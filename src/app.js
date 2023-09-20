import express from "express";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import __dirname from "./utils.js";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js'
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';



const app = express();
const server = app.listen(8080, ()=> console.log('Listening on PORT 8080'));
const io = new Server(server);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars')

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)
app.use('/api/chat',chatRouter)

app.use(express.static(__dirname+'/public'));
app.use('/',viewsRouter)

try {
    mongoose.connect('mongodb+srv://juanzacarias:coderhouse@cluster0.omgo4ez.mongodb.net/',{
        dbName: 'e-commerce'
    })
    console.log('Connected to E-Commerce DB')
} catch (error) {
    console.log({status:'error', error: error.message})
}

io.on('connection', socket=>{
    console.log('Socket connected');
    socket.on('updatedProducts', data=>{
        io.emit('newProductsList', data)
    })
    socket.on('newMessage', data =>{
        io.emit('log', data)
    })
})



