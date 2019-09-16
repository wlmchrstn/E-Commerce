const mongoose = require('mongoose');
const User = require('./user.js');

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        default: 0
    },
    orderDetail: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail"
    }]
})

var Order = mongoose.model('Order', orderSchema);

Order.addOrder = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        Order.create(data)
            .then(result => {
                User.findById(auth, (err, data) => {
                    data.orders.push(result)
                    result.users = req.user
                    result.save( (err, data) => {
                        resolve([201, data, 'Order list created!'])
                    })
                })
            })
            .catch(err => {
                reject([422, "Unexpected error! Failed to create order!"])
            })
    })
}
Order.removeOrder = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        Order.findById()
    })
}

module.exports = Order;
