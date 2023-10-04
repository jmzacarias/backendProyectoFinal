import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/mongooseManagers/cartsManager.js";
import cartsDAO from "../dao/mongooseManagers/models/cartsSchema.js";
import productsDAO from "../dao/mongooseManagers/models/productsSchema.js";

const router = Router()

const cartManager = new CartManager();
router.get('/', async (req,res)=>{
    try {
        console.log(await cartManager.createCart())
        return res.status(200).json({status: 'Success', payload: await cartManager.createCart()})   
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }

})

router.get('/:cid', async (req, res) => {
    try {
        let cid = req.params.cid;
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartExists = await cartsDAO.exists({ _id: cid });
        console.log(cartExists);
        if (cartExists) {
            let result = await cartsDAO.findById(cid).populate('products.product').lean();
            return res.status(200).json({ status: 'success', payload: result });
        }
        return res.status(400).json({ status: 'error', error: `There is no cart with ID: ${cid}` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
});


router.post('/:cid/products/:pid', async(req,res)=>{

    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        console.log(cid, pid)
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid) || !validObjectIdRegex.test(pid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID or PID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartExists = await cartsDAO.exists({ _id: cid })
        let productExists = await productsDAO.exists({_id: pid});
        if(!productExists) return res.status(400).json({status:'error', error:`[ERROR] There is no product with Id ${pid} available`});
        if(!cartExists) return res.status(400).json({status:"error", error: `There is no cart with ID: ${cid}`})
        let updatedCart = await cartManager.addProduct(cid,pid)
        console.log(updatedCart)
        return res.status(200).json({status: 'success', payload: updatedCart})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
 
})

router.delete('/:cid/products/:pid', async(req,res)=>{
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid) || !validObjectIdRegex.test(pid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID or PID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartToUpdate = await cartsDAO.findById( cid )
        if(!cartToUpdate) return res.status(400).json({status:"error", error: `There is no cart with ID: ${cid}`})
        let productIndex = cartToUpdate.products.findIndex(product=>product.product.toString()===pid);
        if(productIndex ===-1) return res.status(400).json({status:'error', error:`[ERROR] Product ${pid} couldn't be found in cart ${cid}`});
        // let updatedCart = await cartManager.deleteProduct(cid,pid);
        let updatedCart = await cartsDAO.updateOne(
            {_id:cid},
            {$pull:{products:{product:pid}}}
        )
        return res.status(200).json({status: 'success', payload: updatedCart}) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message }); 
    }

})

router.put('/:cid', async(req,res)=>{
    try {
        let cid = req.params.cid
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartToUpdate = await cartsDAO.findById(cid)
        if(!cartToUpdate) return res.status(400).json({status: 'error', error:`There's no cart with ID ${cid}`})
        let dataToUpdate = req.body
        if(!Array.isArray(dataToUpdate.products)) return res.send(400).json({status: 'error', error: 'Structure must be "{products: [{product: String ,quantity: Number }, etc]}"'})
        let unexistingProducts = []
        let missingFieldsProducts = []
        for (const product of dataToUpdate.products) {
            if(!validObjectIdRegex.test(product.product)) {
                return res.status(400).json({ status: 'error', error: 'Invalid PRODUCT format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' })
            }
            if(!product.product || !product.quantity) missingFieldsProducts.push(product)
            let findProduct = await productsDAO.findById(product.product)
            let productToAdd = {product:product.product, quantity:product.quantity}
            if(!findProduct) {
                unexistingProducts.push(product.product)
            }else{
                let productInCartIndex = cartToUpdate.products.findIndex(item=>item.product.toString()===product.product)
                if(productInCartIndex===-1) {
                    cartToUpdate.products.push(productToAdd)
                }else{
                    cartToUpdate.products[productInCartIndex].quantity += product.quantity
                }
            }
        }
        if(missingFieldsProducts.length>0) return res.status(400).json({status: 'error', error: 'Structure must be "{products: [{product: String ,quantity: Number }, {...},{...}]}"'})
        if(unexistingProducts.length>0) return res.status(400).json({status:'error', error: `There are no products with IDs: ${unexistingProducts} available`})
        await cartsDAO.findByIdAndUpdate(cid, cartToUpdate)
        let result = await cartsDAO.findById(cid)
        return res.status(200).json({status:'success', payload:result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message }); 
    }
 
})

router.put('/:cid/products/:pid', async(req,res)=>{
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let quantity = req.body.quantity
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid) || !validObjectIdRegex.test(pid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        if(isNaN(quantity)) return res.status(400).json({status: 'error', error: 'Quantity must be a number' })
        let cartToUpdate = await cartsDAO.findById(cid)
        if(!cartToUpdate) return res.status(400).json({status:'error', error: `There is no cart with ID ${cid}`})
        let productToUpdateIndex = cartToUpdate.products.findIndex(product => product.product.toString() === pid)
        if(productToUpdateIndex===-1) return res.status(400).json({status:`Cart with ID ${cid} doesn't contain products with ID ${pid}`})
        cartToUpdate.products[productToUpdateIndex].quantity += quantity
        await cartsDAO.findByIdAndUpdate(cid,cartToUpdate)
        let result = await cartsDAO.findById(cid)
        return res.status(200).json({status: 'success', payload: result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message }); 
    }
    
})

router.delete('/:cid', async(req,res)=>{
    try {
        let cid= req.params.cid
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(cid)) {
            return res.status(400).json({ status: 'error', error: 'Invalid CID format; Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' });
        }
        let cartToUpdate = await cartsDAO.findById(cid)
        if(!cartToUpdate) return res.status(400).json({status: 'error', error: `There is no Cart wiht ID ${cid}`})
        cartToUpdate.products = []
        await cartsDAO.findByIdAndUpdate(cid, cartToUpdate)
        let result = await cartsDAO.findById(cid)
        return res.status(200).json({status: 'success', payload: result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', error: error.message });     
    }

})


export default router