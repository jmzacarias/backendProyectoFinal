
import messageDAO from "./models/chatSchema.js";

class MessageManager {
    constructor (){

    }
    getMessages = async()=>{
        const messages = await messageDAO.find()
        return messages
    }

    createMessage = async(message)=>{
        const newMessage = await messageDAO.create(message)
    }
}

export default MessageManager