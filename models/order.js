const mongoose = require('mongoose');
const Profile = require('./profile.js');

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        default: 0
    },
    profiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    orderDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Detail"
    }]
})

var Order = mongoose.model('Order', orderSchema);

Order.addOrder = async function(auth, id, data) {
    return new Promise(async function(resolve,reject) {
        let valid = await Profile.findById(id)
        if(valid.role !== 'Buyer') return ([403, 'Failed to create orders! You are not a buyer!'])
        try{
            Order.create(data)
            .then(result => {
                Profile.findById(auth, (err, hasil) => {
                    hasil.orders.push(result)
                    result.profiles = auth
                    result.save( (err, res) => {
                        resolve([201, res, 'Order list created!'])
                    })
                })
            })
            .catch(err => {
                reject([400, "Bad Request! Failed to create order!"])
            })
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to create order!'])
        }
    })
}
Order.removeOrder = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        let valid = await Order.findById(data)
        if(!valid) return reject([404, 'Order not found!'])
        if(valid.profiles !== auth._id) return reject([403, 'This is not your order!'])
        try{
            Order.findById(data)
            .populate('profiles', '_id')
            .exec((err, hasil) => {
                Order.findByIdAndDelete(hasil._id)
                    .then(
                        Profile.updateOne(
                            { _id: id },
                            { $pullAll: { orders: [data]} },
                            { safe: true, multi: true })
                                .then(result => {
                                    resolve([200, 'Order deleted!'])
                                })
                    )
            })
        }
        catch(err) {
            reject([422, 'Unexpected error! Failed to delete order!'])
        }
    })
}

module.exports = Order;
