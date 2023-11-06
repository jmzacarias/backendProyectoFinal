import { Router } from "express";
import __dirname from "../utils.js"; 
import usersDAO from "../dao/mongooseManagers/models/usersSchema.js";
import UserManager from "../dao/mongooseManagers/usersManager.js";

const userManager = new UserManager()
const router = Router();

router.get('/logout', async(req,res)=>{
    req.session.destroy(error=>{
        if(error) res.send('Logout error')
    }) 
    res.redirect('/')
})
router.post('/register', async(req,res)=>{
    try {
        let newUser = req.body;
        let result = await userManager.addUser(newUser)    
        if(typeof result === 'String') return res.status(400).send({status: 'error', error: result})
        return res.status(200).send({status: 'success', payload: result})
    } catch (err) {
        console.log(err.message)
    }
})

router.post('/login', async(req,res)=>{
    const { email , password }= req.body
    console.log(email, password)
    if(email === `adminCoder@coder.com` && password === `adminCod3r123`) {
        req.session.user = {
            email,
            role: admin
        }
        return res.redirect('/products')
    }
    let user = await usersDAO.findOne({ email, password }).lean().exec()
    if(user===null) {
        return res.redirect('./')
    }
    user.role = 'user'
    req.session.user = user
    return res.redirect('/products')
})


export default router