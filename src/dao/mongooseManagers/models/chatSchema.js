import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userEmail: {
        type: String,
    },
    message: {
        type: String,
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

const messageDAO = mongoose.model('message',messageSchema)


export default messageDAO