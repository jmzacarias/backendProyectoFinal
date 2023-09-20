import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/mongooseManagers/cartsManager.js";

const router = Router()

const cartManager = new CartManager();
router.get('/', async (req,res)=>{
    console.log(await cartManager.createCart())
    return res.status(200).json({status: 'Success', payload: await cartManager.createCart()})
})

router.post('/:cid/product/:pid', async(req,res)=>{
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    if(isNaN(cid) || isNaN(pid)) return res.send(400).json({status: 'error', error: 'Params must be numbers'})
    let updatedCart = await cartManager.addProduct(cid,pid)
    return res.status(200).json({status: 'success', payload: updatedCart})
})
export default router