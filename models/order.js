const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: false,
        default: 0
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
})

orderSchema.plugin(uniqueValidator)
var Order = mongoose.model('Order', orderSchema);

module.exports = Order