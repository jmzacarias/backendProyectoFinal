import express from "express";
import __dirname from "./utils.js";
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';

const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)
app.use(express.static(__dirname+'/public'));

app.listen(8080, ()=> console.log('Listening on PORT 8080'))

