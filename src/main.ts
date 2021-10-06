require('dotenv').config();

import {Request, Response} from "express";
import * as express from "express";

const http = require("http");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


app.use(cors())
const PORT = process.env.PORT || 3100;

const server = http.createServer();

server.on('request', (req: Request, res: Response) => {
  res.end('server worked!!!')
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const HOST = '127.0.0.1'

let refreshTokensDB = [];

function generateAccessToken(payload){
  console.log(process.env.ACCESS_TOKEN_SECRET)
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m'});
}

app.post('/register', async (req, res) => {

  try{
    const usersDB = await pool.query(`SELECT * FROM users`)

    const users = usersDB.rows

    let foundUser = users.find((data) => req.body.username === data.username);
    if (!foundUser) {

      let hashPassword = await bcrypt.hash(req.body.password, 10);

      let newUser = {
        id: Date.now(),
        username: req.body.username,
        password: hashPassword,
        is_admin: false
      };

      pool.query(
          `INSERT INTO users(username, password, is_admin)
            VALUES('${newUser.username}', '${newUser.password}', '${newUser.is_admin}')`,
          (err, res) => {
            console.log(err, res);
            pool.end();
          }
      );

      res.json({ message: 'Registration successful'});
    } else {
      res.json({ message: 'Registration failed'});
    }
  } catch{
    res.json({ message: 'Internal server error' });
  }
});

app.post("/login", async function(req, res) {
  let username = String(req.body.username);

  let password = String(req.body.password);

  try {
    const usersDB = await pool.query(`SELECT * FROM users`)

    const users = usersDB.rows

    let foundUser = users.find((data) => username === data.username);


    if (foundUser) {

      let submittedPass = password;
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (passwordMatch) {

        const payload = { username };

        const aToken = generateAccessToken(payload);

        const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

        refreshTokensDB.push(rToken);			// it will store the newly generated refresh tokens

        res.json({ AccessToken: aToken , RefreshToken: rToken , message: 'You are logged-in'});

      } else {
        res.json({ message: 'Invalid email or password'});
      }
    }
    else {

      let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;		//fake password is used just to slow down the time required to send a response to the user
      await bcrypt.compare(password, fakePass);

      res.json({ message: 'Invalid email or password'});
    }
  } catch{
    res.json({ message: 'Internal server error'});
  }
});

app.set('port', PORT)

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/dishes/:categoryId", async (req: Request, res: Response) => {
  const dishes = await pool.query(`SELECT * FROM dishes where dishes.categoryId=${req.params.categoryId}`)
  res.status(200).json(dishes.rows)
})

app.get("/order", async (req: Request, res: Response) => {
  const image = await pool.query(`SELECT * FROM order_items ORDER by id ASC`)
  res.status(200).json(image.rows)
})

app.get("/order-info", async (req: Request, res: Response) => {
  const order_items = await pool.query(`SELECT oi.id, d.id, d.title, d.ingredients, d.price, i.id, i.url, d.categoryid, oi.count
    FROM order_items AS oi
    INNER JOIN dishes AS d ON d.id = oi.item_id
    INNER JOIN images AS i ON i.id = d.image_id`)
  res.status(200).json(order_items.rows)
})

app.get("/dishes-info/:id", async (req: Request, res: Response) => {
  const dishInfo = await pool.query(`SELECT d.id, d.title, d.ingredients, d.price, i.url
  FROM dishes AS d 
  INNER JOIN images AS i ON i.id = d.image_id
  WHERE d.categoryid=${req.params.id}`)
  res.status(200).json(dishInfo.rows)
})

app.get("/all_dishes-info", async (req: Request, res: Response) => {
  const dishInfo = await pool.query(`SELECT d.id, d.title, d.ingredients, d.price, i.url
  FROM dishes AS d 
  INNER JOIN images AS i ON i.id = d.image_id`)
  res.status(200).json(dishInfo.rows)
})

app.get('/categories', async (req: Request, res: Response) => {
  const navImages = await pool.query(`SELECT ni.id, ni.url, cat.id AS cat_id
  FROM nav_images AS ni 
  INNER JOIN categories AS cat ON cat.id = ni.category_id`)
  res.status(200).json(navImages.rows)
})

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

