import { Router } from "express";
import __dirname from "../utils.js";
import { uploader } from "../utils.js";
// import ProductManager from "../managers/productsManager.js";
import ProductManager from "../dao/mongooseManagers/productsManager.js";


const router = Router()

const productManager = new ProductManager();

router.get('/', async(req,res)=>{    
    const limit = req.query.limit;
    const data = await productManager.getProducts();
    if(!limit) return res.status(200).json({status:'Success', payload: data})
    if(isNaN(limit)) return res.status(400).json({status: 'error', error: '[ERROR] Query params must be a number'})
    return res.status(200).json({status: 'Success', payload: data.slice(0,limit)})
})

router.get('/:pid',async(req,res)=>{
    let id= parseInt(req.params.pid);
    if(!req.file) res.status(500).json({status:"error",error:"Couldn't upload file"})
    if(isNaN(id)) return res.status(404).json({status: 'error', error:'[ERROR] Params must be a number'});
    let data = await productManager.getProductById(id);
    return res.status(200).json({status: 'success', payload: data})
})

router.post('/',uploader.single('thumbnail'),async(req,res)=>{
    console.log(req.body)
    const {title,description,code,category,stock,price} = req.body;
    
    let newProduct = {
        title,
        description,
        code,
        category,
        stock,
        price,
        // thumbnail: req.file.filename
    };
    console.log(newProduct)

    if(typeof newProduct.title !== 'string' || 
        typeof newProduct.description !== 'string' ||
        typeof newProduct.code !== 'string' || 
        typeof newProduct.category !== 'string' || 
        isNaN(newProduct.stock)|| 
        isNaN(newProduct.price)) 
            return res.status(400).json({status: 'error', error:'Missing fields'});  
    let result = await productManager.addProduct(newProduct)  
    console.log(result.slice(7))
    if(result.typeOf==="string") return res.status(400).json({status: 'Error', error: result.slice(7)})
    return res.status(200).json({status: 'Success', payload: newProduct })
})

router.put('/:pid',async(req,res)=>{
    let id = parseInt(req.params.pid);
    if(isNaN(id)) return res.status(404).json({status: 'error', error:'Params must be a number'});
    let dataToUpdate = req.body;
    let updatedProduct = await productManager.updateProduct(id,dataToUpdate);
    return res.status(200).json({status: 'Success', payload: {updatedProduct: updatedProduct}})
})

router.delete('/:pid', async(req,res)=>{
    let id = parseInt(req.params.pid);
    if(isNaN(id)) return res.status(404).json({status: 'error', error:'Params must be a number'});
    return res.status(200).json({status:'Success', payload: await productManager.deleteById(id)})
})
export default router