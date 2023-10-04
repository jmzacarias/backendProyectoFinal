import { Router } from "express";
import __dirname from "../utils.js";
// import ProductManager from "../managers/productsManager.js";
import ProductManager from "../dao/mongooseManagers/productsManager.js";
import cartsDAO from "../dao/mongooseManagers/models/cartsSchema.js";
import productsDAO from "../dao/mongooseManagers/models/productsSchema.js";


const router = Router();
const productManager = new ProductManager();

router.get('/',async(req,res)=>{
    let products= await productManager.getProducts();
    res.render('home',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    let products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})


router.get('/chat',async(req,res)=>{
    res.render('chat')
})

router.get('/carts/:cid', async(req,res)=>{
    try {
        let cid = req.params.cid;
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartExists = await cartsDAO.exists({ _id: cid });
        if (cartExists) {
            let cart = await cartsDAO.findById(cid).populate('products.product').lean().exec();
            let cartToRender = []
            console.log(JSON.stringify(cart.products))
            for (const product of cart.products){
                cartToRender.push(product.product)
            }
            return res.render('cart', {cart})
        }
        return res.status(400).json({ status: 'error', error: `There is no cart with ID: ${cid}` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
})

router.get('/products', async(req,res)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const sort = req.query.sort;
        const paginateOptions = {lean:true, limit:limit, page:page}
        const filterOptions = {}
        if(sort==="asc") filterOptions.sort={price:1}
        if(sort==="des") filterOptions.sort={price:-1}
        const category = req.query.category;
        if(category) filterOptions.category=category;
        const stock = req.query.stock;
        if(stock) filterOptions.stock= {$gt:stock}
    
        const data = await productsDAO.paginate(filterOptions,paginateOptions)
        console.log({dataLine66:data})
        let prevLink
        let nextLink
        const totalPages = []
        let link
        for (let index=1; index <= data.totalPages; index++) {
            if(!req.query.page){
                link = `http://${req.hostname}:8080${req.originalUrl}?page=${index}`
            }else{
                const modifiedUrl = req.originalUrl.replace(`page=${data.page}`, `page=${index}`)
                link= `http://${req.hostname}:8080${modifiedUrl}`
            }
            totalPages.push({page:index, link:link})
        }
        if(!req.query.page) {
            prevLink= `http://${req.hostname}:8080${req.originalUrl}?page=${data.prevPage}`
        }else{
            const modifiedUrl = req.originalUrl.replace(`page=${data.page}`, `page=${data.prevPage}`)
            prevLink= `http://${req.hostname}:8080${modifiedUrl}`
        }
        if(!req.query.page) {
            nextLink= `http://${req.hostname}:8080${req.originalUrl}?page=${data.nextPage}`
        }else{
            const modifiedUrl = req.originalUrl.replace(`page=${data.page}`, `page=${data.nextPage}`)
            nextLink= `http://${req.hostname}:8080${modifiedUrl}`
        }
        console.log({prevLink:prevLink, nextLink:nextLink})

        return res.render('products', { products: data.docs, paginateInfo: {
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            totalPages: totalPages
        } })    
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', error: error.message})
    }
})

export default router