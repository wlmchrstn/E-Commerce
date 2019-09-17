const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    subtotal: {
        type: Number,
        default: 0
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
})

var Detail = mongoose.model('Detail', detailSchema)

module.exports = Detail;
