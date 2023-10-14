import { Router } from "express";
import productsDAO from "../../dao/mongooseManagers/models/productsSchema.js";

const router = Router()

// router.get('/',async(req,res)=>{
//     let products= await productManager.getProducts();
//     res.render('home',{products})
// })

router.get('/realtimeproducts',async(req,res)=>{
    let products = await productManager.getProducts();
    res.render('realTimeProducts',{products})
})

router.get('/', async(req,res)=>{
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
        let user = req.session.user

        return res.render('products', { user, products: data.docs, paginateInfo: {
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