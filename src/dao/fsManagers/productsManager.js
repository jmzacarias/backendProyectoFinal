import fs from 'fs';
import __dirname from '../utils.js';

class ProductManager {
    #path
    constructor(){
        this.#path = (__dirname+'/files/products.json')
    }

    getProducts = async()=>{
        if(!fs.existsSync(this.#path)) return [];
        const fileData = await fs.promises.readFile(this.#path, 'utf-8');
        const products = JSON.parse(fileData)
        return products
    }

    getProductById = async(id)=>{
        let products = await this.getProducts();
        let productById = products.find(item => item.id ===id)
        if(!productById) return `[ERROR] There is no product with Id ${id}`
        return productById
    }

    addProduct = async(product)=>{
        let products = await this.getProducts();
        let productToAdd = product;
        let validateCode = products.find(item => item.code === product.code);
        if(validateCode) return '[ERROR] Code already exists';
        productToAdd.id = products.length < 1 ? 1 : products[products.length-1].id+1;
        productToAdd.status = true;
        if(!product.thumbnails) product.thumbnails = [];
        products.push(productToAdd)
        await fs.promises.writeFile(this.#path,JSON.stringify(products,null,'\t'))
        return productToAdd;
    }

    updateProduct = async(id,dataToUpdate)=>{
        let products = await this.getProducts();
        let productById = products.find(item => item.id ===id)
        if(!productById) return `[ERROR] There is no product with Id ${id}`
        let indexToUpdate = products.findIndex(item => item.id === id);
        products[indexToUpdate] = {...products[indexToUpdate], ...dataToUpdate};
        await fs.promises.writeFile(this.#path,JSON.stringify(products,null,'\t'))
        return products[indexToUpdate]
    }

    deleteById = async(id) => {
        let products = await this.getProducts();
        let indexToDelete = products.findIndex(item => item.id===id)
        if(indexToDelete === -1) return `[ERROR] There is no product with Id ${id}`
        let deletedProduct = products[indexToDelete];
        console.log(products[1])
        products.splice(indexToDelete,1);//Si no funciona guardar esto en una nueva variable
        console.log(products)
        await fs.promises.writeFile(this.#path,JSON.stringify(products,null,'\t'))
        return {deletedProduct:deletedProduct}
    }


}

export default ProductManager
