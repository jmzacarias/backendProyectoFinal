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
        console.log({newUserenRegister: newUser})
        let result = await userManager.addUser(newUser)
        let typeOf = typeof result
        console.log({typeOfResult: typeOf})
        if(typeof result === 'string') return res.status(400).send({status: 'error', error: result})
        return res.status(200).send({status: 'success', payload: result})
    } catch (err) {
        console.log(err.message)
    }
})


router.post('/login', async(req,res)=>{
    const { email , password } = req.body
    console.log(email + password)
    if(email === `adminCoder@coder.com` && password === `adminCod3r123`) {
            await new Promise((resolve, reject)=>{
                req.session.user = {
                    email,
                    role: 'admin'
                }  
            resolve()
        })
        return res.status(200).send({status: 'succes', user: req.session.user})
    }
    let user = await usersDAO.findOne({ email, password }).lean().exec()
    console.log({user43sessionrouter:user})
    if(user===null) {
        return res.status(400).send({status: '[ERROR]', error: 'Credenciales incorrectas'})
    }
        user.role = 'user'
        req.session.user= user
    return res.status(200).send({status: 'succes', user: req.session.user})
})

export default router