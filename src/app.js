import express, { application } from "express";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import __dirname from "./utils.js";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js'
import handlebars from 'express-handlebars';
import sessionsRouter from './routes/sessions.router.js';
import productsViewsRouter from './routes/viewsRoutes/products-views.router.js'
import cartsViewsRouter from './routes/viewsRoutes/carts-views.router.js'
import chatViewsRouter from './routes/viewsRoutes/chat-views.router.js'
import sessionViewsRouter from './routes/viewsRoutes/sessions-views.router.js'



const app = express();
const server = app.listen(8080, ()=> console.log('Listening on PORT 8080'));
const io = new Server(server);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars')
app.use(express.json());
app.use(express.static(__dirname+'/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://juanzacarias:coderhouse@cluster0.omgo4ez.mongodb.net/',
        dbName: 'e-commerce'
    }),
    secret: 'palabraclave',
    resave:true,
    saveUninitialized: true
}))


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
        console.log({Linea41APP:data})
        io.emit('newProductsList', data)
    })
    socket.on('newMessage', data =>{
        console.log(data)
        io.emit('log', data)
    })
})


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)
app.use('/api/chat',chatRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/',sessionViewsRouter)
app.use('/products', productsViewsRouter)
app.use('/carts', cartsViewsRouter)
app.use('/chat', chatViewsRouter)





