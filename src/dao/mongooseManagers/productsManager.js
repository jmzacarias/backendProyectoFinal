import mongoose from "mongoose";
import productsDAO from "./models/productsSchema.js";

class ProductManager {
    constructor (){
       
    }

    getProducts = async()=>{
        const products = await productsDAO.find().lean().exec()
        return products
    }


    getProductById = async(id)=>{
        let productById = await productsDAO.findOne({_id: id}).lean().exec()
        if(!productById) return `[ERROR] There is no product with Id ${id}`
        return productById
    }

    addProduct = async(product)=>{
        let validateCode = await productsDAO.findOne({code:product.code})
        if(validateCode) return '[ERROR] Code already exists';
        return await productsDAO.create(product)
    }

    updateProduct = async(id,dataToUpdate)=>{
        let updatedProduct = await productsDAO.findOneAndUpdate({_id},dataToUpdate,{new:true}).lean().exec()
        if(!updatedProduct) return `[ERROR] There is no product with Id ${id}`
        return updatedProduct
    }

    deleteById = async(id) => {
        let deletedProduct = await productsDAO.findByIdAndDelete(id)
        if(!deletedProduct) return `[ERROR] There is no product with Id ${id}`
        return {deletedProduct:deletedProduct}
    }
}

export default ProductManager