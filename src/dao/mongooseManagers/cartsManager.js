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

    addProduct = async(pid,cid)=>{
        let productToAdd = await productManager.getProductById(pid);
        if(!productToAdd) return `[ERROR] There is no product with Id ${pid}`;
        let cartToUpdate = await cartsDAO.findById(cid);
        if(!cartToUpdate) return `[ERROR] There is no cart with Id ${cid}`
        let isProductInCart = cartToUpdate.products.find(item => item._id.toString() === pid);
        if(isProductInCart) {
            isProductInCart.qty += 1
        }else{
            cartToUpdate.products.push({_id:pid,qty:1})
        }
        return await cartsDAO.findById(cid)
    }
}

export default CartManager;