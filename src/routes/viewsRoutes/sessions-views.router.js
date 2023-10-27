import { Router } from "express";
import { isAuth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get("/",  (req, res) => {
  let user = req.session.user
  if(!user) {
    res.render('sessions/login')  
  }else{
   res.render('sessions/profile', {user})   
  }
})

router.get('/register', (req,res)=>{
    res.render('sessions/register')
})


router.get('/profile',(req,res)=>{
    let user = req.session.user
    if(!user) {
      res.render('sessions/login')  
    }else{
     res.render('sessions/profile', {user})   
    }
})


export default router