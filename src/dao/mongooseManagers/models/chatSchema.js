import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
        userEmail: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required:true},
        timestamp:{
            type: Date,
            default: Date.now
        }
    }
})

const messageDAO = mongoose.model('message',messageSchema)


export default messageDAO