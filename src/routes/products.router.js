import { Router } from "express";
import __dirname from "../utils.js";
import { uploader } from "../utils.js";
import ProductManager from "../dao/mongooseManagers/productsManager.js";
import productsDAO from "../dao/mongooseManagers/models/productsSchema.js";


const router = Router()

const productManager = new ProductManager();

router.get('/', async(req,res)=>{    
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const paginateOptions = {limit:limit, page:page}
    const filterOptions = {}
    if(sort==="asc") filterOptions.sort={price:1}
    if(sort==="des") filterOptions.sort={price:-1}
    const category = req.query.category;
    if(category) filterOptions.category=category;
    const stock = req.query.stock;
    if(stock) filterOptions.stock= {$gt:stock}

    const data = await productsDAO.paginate(filterOptions,paginateOptions);
    console.log({dataLin27:data})
    let prevLink 
    if(data.hasPrevPage===true) {
        prevLink= `http://${req.hostname}:8080${req.originalUrl}&page=${data.prevPage}`
    }
    let nextLink
    if(data.hasNextPage===true) {
        prevLink= `http://${req.hostname}:8080${req.originalUrl}&page=${data.nextPage}`
    }
    let dataToSend = {
        payload: data.docs,
        totalpages:data.totalpages,
        prevPage:data.prevPage,
        nextPage:data.nextPage,
        page:data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage:data.hasNextPage,
        prevLink:prevLink,
        nextLink:nextLink
    }
    return res.status(200).json(dataToSend)

})

router.get('/:pid',async(req,res)=>{
    let id= req.params.pid;
    // if(isNaN(id)) return res.status(404).json({status: 'error', error:'[ERROR] Params must be a number'});
    let data = await productManager.getProductById(id);
    return res.status(200).json({status: 'success', payload: data})
})

router.post('/',uploader.single('thumbnail'),async(req,res)=>{
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

    if(typeof newProduct.title !== 'string' || 
        typeof newProduct.description !== 'string' ||
        typeof newProduct.code !== 'string' || 
        typeof newProduct.category !== 'string' || 
        isNaN(newProduct.stock)|| 
        isNaN(newProduct.price)) 
            return res.status(400).json({status: 'error', error:'Missing fields'});  
    let result = await productManager.addProduct(newProduct)  
    console.log(result)
    if(result.typeOf==="string") return res.status(400).json({status: 'Error', error: result.slice(7)})
    return res.status(200).json({status: 'Success', payload: newProduct })
})

router.put('/:pid',async(req,res)=>{
    let id = req.params.pid;
    // if(isNaN(id)) return res.status(404).json({status: 'error', error:'Params must be a number'});
    let dataToUpdate = req.body;
    let updatedProduct = await productManager.updateProduct(id,dataToUpdate);
    return res.status(200).json({status: 'Success', payload: {updatedProduct: updatedProduct}})
})

router.delete('/:pid', async(req,res)=>{
    let id = req.params.pid;
    // if(isNaN(id)) return res.status(404).json({status: 'error', error:'Params must be a number'});
    return res.status(200).json({status:'Success', payload: await productManager.deleteById(id)})
})
export default router