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
    let user = await usersDAO.findOne({ email, password }).lean().exec()
    console.log(user)
    if(user===null) {
        console.log(user)
        return res.redirect('./')
    }
    if(user.email === `adminCoder@coder.com` && user.password === 'adminCod3r123'){
        user.role = 'admin'
    }else{
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/products')
})


export default router