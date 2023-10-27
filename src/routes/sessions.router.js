import { Router } from "express";
import __dirname from "../utils.js";
import usersDAO from "../dao/mongooseManagers/models/usersSchema.js";
import UserManager from "../dao/mongooseManagers/usersManager.js";
import { isValidPassword } from "../utils.js";
import passport from 'passport'
 
const userManager = new UserManager()
const router = Router();


router.get('/logout', async(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res.status(500).render("errors/base", { error: err });
        } else res.redirect("/");
      });
})
router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failRegister'}), async(req,res)=>{
    try {
        return res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/failRegister', (req,res) => res.send({error: 'Register failed'}))

router.post('/login', passport.authenticate('login', {failureRedirect: '/failLogin'}), async(req,res)=>{
    try {
        if(!req.user) return res.status(400).send({status: 'error', error: 'Invalid credentials'})
        await new Promise((resolve, reject) => {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age
            }
            if(req.user.email === 'adminCoder@coder.com') {
                req.session.user.role= 'admin'
            } else {
                req.session.user.role= 'user'
            }
            resolve();
        });

        return res.redirect('/products')
    } catch (error) {
        res.status(400).send({status: 'error', error: error.message})
    }
 
})

router.get('/failLogin', (req,res) => res.send({error:' Login Failed'}))

router.get('/github', passport.authenticate('github', { scope: ['user:email']}), (req, res)=>{

})

router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login'}), async(req,res)=>{
    try {
        await new Promise((resolve, reject) => {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age
            }
            if(req.user.email === 'adminCoder@coder.com') {
                req.session.user.role= 'admin'
            } else {
                req.session.user.role= 'user'
            }
            resolve();
        });

        return res.redirect('/products')
    } catch (error) {
        res.status(400).send({status: 'error', error: error.message})
    }
    req.session.user = req.user
    res.redirect('/products')
})

export default router