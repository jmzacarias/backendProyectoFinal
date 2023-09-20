import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

const cartsDAO = mongoose.model('cart', cartsSchema)


export default cartsDAO