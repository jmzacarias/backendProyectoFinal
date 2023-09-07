import { Router } from "express";
import ProductManager from "../managers/productsManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/',async(req,res)=>{
    let products = await productManager.getProducts();
    res.render('home',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    let products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})

export default router