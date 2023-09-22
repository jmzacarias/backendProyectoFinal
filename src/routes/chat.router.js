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
    await messageManager.createMessage(req.body)
    return res.status(200).json({status: 'success', payload: req.body})
})
export default router