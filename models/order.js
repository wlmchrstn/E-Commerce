const mongoose = require('mongoose');
const Profile = require('./profile.js');
const User = require('./user.js');

const orderSchema = new mongoose.Schema({
    details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Detail"
    }],
    total: {
        type: Number
    },
    profiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
})

var Order = mongoose.model('Order', orderSchema);

Order.addOrder = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        let user = User.findById(auth)
        let id = user.profiles[0].toString();
        let valid = await Profile.findById(id)
        if(valid.role !== 'Buyer') return ([403, 'Failed to create orders! You are not a buyer!'])
        try{
            Order.create(data)
            .then(result => {
                console.log(result)
                Profile.findById(id, (err, hasil) => {
                    console.log(hasil.orders)
                    hasil.orders.push(result)
                    hasil.save();
                    result.profiles = id
                    result.save( (err, res) => {
                        let order = {
                            _id: res._id,
                            total: res.total,
                            details: res.details,
                            profiles: res.profiles
                        }
                        resolve([201, order, 'Order created!'])
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
Order.removeOrder = async function(auth, data) {
    return new Promise(async function(resolve, reject) {
        let valid = await Order.findById(data)
        if(!valid) return reject([404, 'Order not found!'])
        let user = User.findById(auth)
        let id = user.profiles[0].toString();
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
