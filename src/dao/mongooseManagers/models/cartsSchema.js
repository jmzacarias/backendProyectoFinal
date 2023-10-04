import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: Number
        }],
        default: [],
    }
})

mongoose.set('strictQuery', false)
const cartsDAO = mongoose.model('cart', cartsSchema)


export default cartsDAO