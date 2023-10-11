import { Router } from "express";
import { privateRoutes , publicRoutes } from "../../middlewares/auth.middleware.js";

const router = Router()

router.get("/", privateRoutes, (req, res) => {
     res.render("sessions/login");   	
})

router.get('/register', (req,res)=>{
    res.render('sessions/register')
})


router.get('/profile',(req,res)=>{
    let user = req.session.user
    console.log(user)
    res.render('sessions/profile', {user})
})


export default router