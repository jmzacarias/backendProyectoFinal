import { Router } from "express";
import __dirname from "../../utils.js";
import ProductManager from "../../dao/mongooseManagers/productsManager.js";
import cartsDAO from "../../dao/mongooseManagers/models/cartsSchema.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();
const productManager = new ProductManager();


router.get('/:cid', auth, async(req,res)=>{
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


export default router