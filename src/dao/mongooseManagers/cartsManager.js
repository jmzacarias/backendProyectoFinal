import mongoose from "mongoose";
import cartsDAO from "./models/cartsSchema.js";
import ProductManager from "./productsManager.js";


const productManager = new ProductManager();

class CartManager {
    constructor (){
        // try {
        //     mongoose.connect('mongodb+srv://juanzacarias:coderhouse@cluster0.omgo4ez.mongodb.net/',{
        //         dbName: 'e-commerce'
        //     })
        //     console.log('Connected to E-Commerce DB')
        // } catch (error) {
        //     console.log({status:'error', error: error.message})
        // }
    }


    getCarts = async()=>{
        const carts = await cartsDAO.find()
        return carts
    }

    getCartByID = async(id)=>{
        let cartById = await cartsDAO.findById(id)
        if(!cartById) return `[ERROR] There is no cart with Id ${cid}`
        return cartById
    }

    createCart = async()=>{
        const createdCart = await cartsDAO.create({products:[]})
        return createdCart
    }

    addProduct = async(cid,pid)=>{
        let productToAdd = await productManager.getProductById(pid);
        if(!productToAdd) return `[ERROR] There is no product with Id ${pid}`;
        let cartToUpdate = await cartsDAO.findById(cid);
        if(!cartToUpdate) return `[ERROR] There is no cart with Id ${cid}`
        let isProductInCart = cartToUpdate.products.find(item => item.product.toString() === pid);
        if(isProductInCart) {
            isProductInCart.quantity += 1
        }else{
            cartToUpdate.products.push({product:pid,quantity:1})
        }
        let result = await cartsDAO.findByIdAndUpdate(cid, cartToUpdate)
        return await cartsDAO.findById(result)
    }

    deleteProduct = async(pid,cid)=>{
        let cartToUpdate = await cartsDAO.findById(cid);
        if(!cartToUpdate) return `[ERROR] There is no cart with Id ${cid}`
        const productToDelete = cartToUpdate.products.find(item=> item.product.toString()===pid)
        if(!productToDelete) return `[ERROR] Product ${pid} couldn't be find in this cart`
        await cartsDAO.updateOne(
            {_id:cid},
            {$pull:{products:{product:pid}}}
        )
        return await cartsDAO.findById(cid)
    }
}

export default CartManager;