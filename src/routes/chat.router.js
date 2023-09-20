import { Router } from "express";
import __dirname from "../utils.js";
import MessageManager from "../dao/mongooseManagers/messageManager.js";

const router = Router()

const messageManager = new MessageManager();

router.get('/', async(req,res)=>{
    const log = await messageManager.getMessages()
    return res.status(200).json({status: 'succes', payload:log})
})
router.post('/', async(req,res)=>{
    const {userEmail,message} = req.body;
    
    let newMessage = {
        userEmail,
        message
    }
    await messageManager.createMessage(newMessage)
    return res.status(200).json({status: 'success', payload: newMessage})
})
export default router