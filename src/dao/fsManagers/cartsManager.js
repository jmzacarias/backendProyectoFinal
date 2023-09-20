 import fs from 'fs';
import __dirname from '../utils.js';
import ProductManager from './productsManager.js';

const productManager = new ProductManager()

class CartManager {
    #path
    constructor(){
        this.#path = (__dirname+'/files/carts.json')
    }

    getCarts = async()=>{
        if(!fs.existsSync(this.#path)) return [];
        const fileData = await fs.promises.readFile(this.#path, 'utf-8');
        const carts = JSON.parse(fileData)
        return carts
    }

    getCartById = async(cid)=>{
        let carts = await this.getCarts();
        let cartById = carts.find(item => item.id ===cid)
        if(!cartById) return `[ERROR] There is no cart with Id ${cid}`
        
        return cartById
    }

    createCart = async()=>{
        let carts = await this.getCarts();
        let newCart = {};
        newCart.id = carts.length < 1 ? 1 : carts[carts.length-1].id+1;
        newCart.products = [];
        carts.push(newCart)
        await fs.promises.writeFile(this.#path,JSON.stringify(carts,null,'\t'))
        return newCart;
    }

    addProduct = async(cid,pid)=>{
        let carts = await this.getCarts();
        let indexToUpdate = carts.findIndex(item => item.id === cid);
        if(indexToUpdate === -1) return `[ERROR] There is no cart with Id ${cid}`;
        let products = await productManager.getProducts();
        let productById = products.find(item => item.id ===pid);
        if(!productById) return `[ERROR] There is no product with Id ${pid}`;
        let productIndexInCart = carts[indexToUpdate].products.findIndex(item=> item.product===pid);
        console.log(productIndexInCart)
        if(productIndexInCart===-1) {
            let newProduct = {product: pid, quantity: 1}
            carts[indexToUpdate].products.push(newProduct);
            // return `Product ${pid} added to cart ${cid}`
            }else{carts[indexToUpdate].products[productIndexInCart].quantity++;}
        await fs.promises.writeFile(this.#path,JSON.stringify(carts,null,'\t'))
        return carts[indexToUpdate]
    }
}

export default CartManager
