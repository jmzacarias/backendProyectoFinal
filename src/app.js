import express from "express";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from 'express-session'
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import passport from 'passport'

import run from "./run.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars')

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

try {
    mongoose.connect('mongodb+srv://juanzacarias:coderhouse@cluster0.omgo4ez.mongodb.net/',{
        dbName: 'e-commerce'
    }) 
    console.log('Connected to E-Commerce DB');

    const server = app.listen(8080, ()=> console.log('Listening on PORT 8080'));
    const io = new Server(server);

    run(io,app)
} catch (error) {
    console.log({status:'error', error: error.message})
}







