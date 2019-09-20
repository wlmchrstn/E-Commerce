const mongoose = require('mongoose');
const Product = require('./product.js');
const User = require('./user.js');
const Order = require('./order')

const detailSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number
    },
    products:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
})

var Detail = mongoose.model('Detail', detailSchema)

Detail.getDetail = async function(auth, id) {
    return new Promise(async function(resolve,reject) {
        try {
            Detail.findById(id)
            .then(result => {
                let hasil = {
                    _id: result._id,
                    products: result.products,
                    amount: result.amount,
                    subtotal: result.subtotal,
                    orders: result.orders
                }
                resolve([200, hasil, 'Here is the detail!'])
            })
            .catch(err => {
                reject([400, 'Bad Request! Failed to get detail!'])
            })
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to get order detail!'])
        }
    })
}

module.exports = Detail;
