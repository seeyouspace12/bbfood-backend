"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express(), http = require("http"), session = require('express-session'), passport = require('passport'), flash = require('connect-flash'), localStrategy = require('passport-local').Strategy, cors = require('cors');
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const server = http.createServer();
server.on('request', (req, res) => {
    res.end('server worked!!!');
});
//Auth
passport.serializeUser(function (user, done) {
    if (user)
        done(null, user);
});
passport.deserializeUser(function (id, done) {
    done(null, id);
});
const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if (error)
                res.status(400).json({ "statusCode": 200, "message": error });
            req.login(user, function (error) {
                if (error)
                    return next(error);
                next();
            });
        })(req, res, next);
    };
};
app.post('/authenticate', auth(), (req, res) => {
    res.status(200).json({ "statusCode": 200, "message": "hello" });
});
passport.use(new localStrategy(function (username, password, done) {
    if (username === "admin" && password === "admin") {
        return done(null, username);
    }
    else {
        return done("unauthorized access", false);
    }
}));
/////////
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield pool.query('SELECT * FROM images ORDER BY id ASC');
    res.status(200).json(images.rows);
}));
app.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json(categories.rows);
}));
app.get("/dishes/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dishes = yield pool.query(`SELECT * FROM dishes where dishes.categoryId=${req.params.categoryId}`);
    res.status(200).json(dishes.rows);
}));
app.get("/dishes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dishes = yield pool.query(`SELECT * FROM dishes ORDER BY id ASC`);
    res.status(200).json(dishes.rows);
}));
app.get("/dish/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dishes = yield pool.query(`SELECT * FROM dishes where dishes.id=${req.params.id} LIMIT 1`);
    res.status(200).json(dishes.rows[0]);
}));
app.get("/images/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield pool.query(`SELECT * FROM images where images.id=${req.params.id} LIMIT 1`);
    res.status(200).json(images.rows[0]);
}));
app.get("/order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield pool.query(`SELECT * FROM order_items ORDER by id ASC`);
    res.status(200).json(image.rows);
}));
app.get("/order-info-beta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order_items = yield pool.query(`SELECT * FROM order_items ORDER by id ASC`);
    for (let order_item of order_items.rows) {
        const dish_item = yield pool.query(`SELECT * FROM dishes where dishes.id=${order_item.item_id}`);
        const image = yield pool.query(`SELECT * FROM images where images.id=${1} LIMIT 1`);
        dish_item.image_id = image.rows;
        order_item.item_id = dish_item.rows;
    }
    res.status(200).json(order_items.rows);
}));
app.get("/order-info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order_items = yield pool.query(`SELECT oi.id, d.id, d.title, d.ingredients, d.price, i.id, i.url, d.categoryid, oi.count
    FROM order_items AS oi
    INNER JOIN dishes AS d ON d.id = oi.item_id
    INNER JOIN images AS i ON i.id = d.image_id`);
    res.status(200).json(order_items.rows);
}));
app.get("/dishes-info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dishInfo = yield pool.query(`SELECT d.id, d.title, d.ingredients, d.price, i.url
  FROM dishes AS d 
  INNER JOIN images AS i ON i.id = d.image_id
  WHERE d.categoryid=${req.params.id}`);
    res.status(200).json(dishInfo.rows);
}));
app.get("/all_dishes-info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dishInfo = yield pool.query(`SELECT d.id, d.title, d.ingredients, d.price, i.url
  FROM dishes AS d 
  INNER JOIN images AS i ON i.id = d.image_id`);
    res.status(200).json(dishInfo.rows);
}));
app.get('/nav-images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const navImages = yield pool.query(`SELECT ni.id, ni.url, cat.id AS cat_id
  FROM nav_images AS ni 
  INNER JOIN categories AS cat ON cat.id = ni.category_id`);
    res.status(200).json(navImages.rows);
}));
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});
//# sourceMappingURL=main.js.map