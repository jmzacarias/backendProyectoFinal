import { Router } from "express";
import __dirname from "../utils.js";
import usersDAO from "../dao/mongooseManagers/models/usersSchema.js";
import UserManager from "../dao/mongooseManagers/usersManager.js";

const userManager = new UserManager()
const router = Router();


router.get('/logout', async(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res.status(500).render("errors/base", { error: err });
        } else res.redirect("/session/login");
      });
})
router.post('/register', async(req,res)=>{
    try {
        let newUser = req.body;
        console.log(newUser)
        let result = await userManager.addUser(newUser)    
        if(typeof result === 'String') return res.status(400).send({status: 'error', error: result})
        return res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/login', async(req,res)=>{
    try {
        const { email , password }= req.body
        let user = await usersDAO.findOne({ email, password }).lean().exec();
        if(user===null) {
            return res.redirect('/')
        }
        if(user.email === `adminCoder@coder.com` && user.password === 'adminCod3r123'){
            user.role = 'admin'
        }else{
            user.role = 'user'
        }
        await new Promise((resolve, reject) => {
            req.session.user = user;
            resolve();
        });

        return res.redirect('/products')
    } catch (error) {
        res.status(400).send({status: 'error', error: error.message})
    }
 
})



export default router