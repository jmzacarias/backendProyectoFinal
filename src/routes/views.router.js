import { Router } from "express";
import __dirname from "../utils.js";
// import ProductManager from "../managers/productsManager.js";
import ProductManager from "../dao/mongooseManagers/productsManager.js";


const router = Router();
const productManager = new ProductManager();

router.get('/',async(req,res)=>{
    let products = await productManager.getProducts();
    console.log(products)
    res.render('home',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    let products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})


router.get('/chat',async(req,res)=>{
    res.render('chat')
})

export default router