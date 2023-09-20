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
        console.log({productRecibidoPorBoyEnManager: validateCode})
        if(validateCode) return '[ERROR] Code already exists';
        await productsDAO.create(product)
        return await this.getProductById(product.id)
    }

    updateProduct = async(id,dataToUpdate)=>{
        let updatedProduct = await productsDAO.findOneAndUpdate({_id},dataToUpdate,{new:true}).lean().exec()
        if(!updatedProduct) return `[ERROR] There is no product with Id ${id}`.lean().exec()
        return updatedProduct
    }

    deleteById = async(id) => {
        let deletedProduct = await productsDAO.findByIdAndDelete(id)
        if(!deletedProduct) return `[ERROR] There is no product with Id ${id}`
        return {deletedProduct:deletedProduct}
    }
}

export default ProductManager