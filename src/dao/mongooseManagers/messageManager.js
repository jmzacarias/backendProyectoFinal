
import messageDAO from "./models/chatSchema.js";

class MessageManager {
    constructor (){

    }
    getMessages = async()=>{
        const messages = await messageDAO.find().lean()
        return messages
    }

    createMessage = async(message)=>{
        return await messageDAO.create(message)
        
    }
}

export default MessageManager