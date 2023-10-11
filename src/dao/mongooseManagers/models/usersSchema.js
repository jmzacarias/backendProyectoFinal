import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }
})

const usersDAO = mongoose.model('users', usersSchema)

export default usersDAO