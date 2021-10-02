import {Request, Response} from "express";
import * as express from "express";

const http = require("http");
const app = express();
const cors = require('cors')
app.use(cors())
const PORT = process.env.PORT || 3000;

const server = http.createServer();

server.on('request', (req: Request, res: Response) => {
  res.end('server worked!!!')
})

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World")
})

app.get("/images", async (req: Request, res: Response) => {
  const images = await pool.query('SELECT * FROM images ORDER BY id ASC')
  res.status(200).json(images.rows)
})

app.get("/categories", async (req: Request, res: Response) => {
  const categories = await pool.query('SELECT * FROM categories ORDER BY id ASC')
  res.status(200).json(categories.rows)
})

app.get("/dishes/:categoryId", async (req: Request, res: Response) => {
  const dishes = await pool.query(`SELECT * FROM dishes where dishes.categoryId=${req.params.categoryId}`)
  res.status(200).json(dishes.rows)
})

app.get("/dishes", async (req: Request, res: Response) => {
  const dishes = await pool.query(`SELECT * FROM dishes ORDER BY id ASC`)
  res.status(200).json(dishes.rows)
})

app.get("/dish/:id", async (req: Request, res: Response) => {
  const dishes = await pool.query(`SELECT * FROM dishes where dishes.id=${req.params.id} LIMIT 1`)
  res.status(200).json(dishes.rows[0])
})

app.get("/images/:id", async (req: Request, res: Response) => {
  const images = await pool.query(`SELECT * FROM images where images.id=${req.params.id} LIMIT 1`)
  res.status(200).json(images.rows[0])
})

app.get("/order", async (req: Request, res: Response) => {
  const image = await pool.query(`SELECT * FROM order_items ORDER by id ASC`)
  res.status(200).json(image.rows)
})

app.get("/order-info-beta", async (req: Request, res: Response) => {
  const order_items = await pool.query(`SELECT * FROM order_items ORDER by id ASC`)
  for(let order_item of order_items.rows) {
    const dish_item = await pool.query(`SELECT * FROM dishes where dishes.id=${order_item.item_id}`)

    const image = await pool.query(`SELECT * FROM images where images.id=${1} LIMIT 1`)
    dish_item.image_id = image.rows

    order_item.item_id = dish_item.rows
  }
  res.status(200).json(order_items.rows)
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

// app.get('/nav-images', async (req: Request, res: Response) => {
//   const navImages = await pool.query('SELECT * FROM nav_images ORDER BY id ASC')
//   res.status(200).json(navImages.rows)
// })
app.get('/nav-images', async (req: Request, res: Response) => {
  const navImages = await pool.query(`SELECT ni.id, ni.url, cat.id AS cat_id
  FROM nav_images AS ni 
  INNER JOIN categories AS cat ON cat.id = ni.category_id`)
  res.status(200).json(navImages.rows)
})



// app.get("/test", async (req: Request, res: Response) => {
//   const result = await pool.query('SELECT * FROM dishes ORDER BY id ASC')
//   for(let dish of result.rows) {
//     const image = await pool.query(`SELECT * FROM images where images.id=${dish.image_id}`)
//     dish.image = image.rows;
//     // const categories = await pool.query(`SELECT * FROM categories where categories.id=${dish.categoryId}`)
//     // dish.type = categories.rows;
//   }
//   res.status(200).json(result.rows)
// })

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
