import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true},
    stock: {type: Number, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: Array},
    category: {type:String},
    status: {
        type:Boolean,
        default:true
    }
})

const productsDAO = mongoose.model('product', productsSchema)



export default productsDAO