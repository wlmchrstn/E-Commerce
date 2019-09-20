const mongoose = require('mongoose');
const Profile = require('./profile.js');
const User = require('./user.js');
const Detail = require('./orderDetail.js');
const Product = require('./product.js');

const orderSchema = new mongoose.Schema({
    details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Detail"
    }],
    total: {
        type: Number,
        default:0
    },
    isDone: {
        type:Boolean,
        default:false
    },
    profiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
})

var Order = mongoose.model('Order', orderSchema);

Order.addOrder = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        let user = await User.findById(auth)
        let id = user.profiles[0].toString();
        let valid = await Profile.findById(id)
        if(valid.role !== 'Buyer') return ([403, 'Failed to create orders! You are not a buyer!'])
        try{
            Order.create(data)
            .then(result => {
                Profile.findById(id, (err, hasil) => {
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
        let user = await User.findById(auth)
        let id = user.profiles[0].toString();
        let ids = valid.profiles.toString()
        if(id !== ids) return reject([403, 'This is not your order!'])
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

Order.getOrder = async function(auth, id) {
    return new Promise(async function(resolve,reject) {
        try{
            let user = await User.findById(auth)
            let profileId = user.profiles[0].toString();
            let order = await Order.findById(id)
            let profId = order.profiles.toString();
            if(profileId !== profId) return reject([403, 'This is not your order!'])
            let hasil = {
                _id: order._id,
                isDone: order.isDone,
                total: order.total,
                details: order.details
            }
            resolve([200, hasil, 'Here is the detail!'])
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to get order detail!'])
        }
    })
}

Order.addProduct = async function(auth, id, data) {
    return new Promise(async function(resolve,reject) {
        try {
            let user = await User.findById(auth)
            let valid = user.profiles[0].toString();
            let order = await Order.findById(id)
            if(!order) return reject([404, 'Order not found!'])
            let profileId = order.profiles.toString();
            if(valid !== profileId) return reject([403, 'This is not your order!'])
            let productId = data.products.toString();
            let product = await Product.findById(productId)
            if(!product) return reject([404, 'Product not found!'])
            let dupe = await Detail.findOne({products: productId})
            if(dupe && (dupe.orders == id)) return reject([422, "Can't add duplicate product"])
            if((data.amount == 0) || (data.amount == null)) return reject([400, "Bad Request! Amount can't be 0"])
            if(data.amount > product.stock) return reject([422, 'Out of stock!'])
            let detail = await Detail.create(data)
            product.stock -= detail.amount
            product.save()
            detail.subtotal = (detail.amount * product.price)
            detail.orders = id
            detail.save()
            order.total += detail.subtotal
            order.details.push(detail)
            order.save()
            let hasil = {
                isDone: order.isDone,
                total: order.total,
                details: order.details,
                profiles: order.profiles
            }
            resolve([200, hasil, 'Product added!'])
        }
        catch(err) {
            reject([422, 'Unexpected error! Failed to add product to order!'])
        }
    })
}

Order.editProduct = async function(auth, id, data) {
    return new Promise(async function(resolve,reject) {
        try{
            let user = await User.findById(auth)
            let valid = user.profiles[0].toString();
            let detail = await Detail.findById(id)
            if(!detail) return reject([404, 'Detail not found!'])
            let orderId = detail.orders.toString();
            let order = await Order.findById(orderId)
            let profileId = order.profiles.toString();
            if(valid !== profileId) return reject([403, 'This is not your order!'])
            if((data.amount == 0) || (data.amount == null)) return reject([400, "Bad Request! Amount can't be 0"])
            let updated = { new: true };
            let product = await Product.findById(detail.products)
            let subtotal = (data.amount * product.price)
            product.stock += detail.amount
            if(data.amount > product.stock) return reject([422, 'Out of stock!'])
            product.stock -= data.amount
            product.save()
            order.total -= detail.subtotal
            order.total += subtotal
            order.save()
            let baru = {
                amount: data.amount,
                subtotal: subtotal
            }
            let result = await Detail.findByIdAndUpdate(id, {$set: baru}, updated)
            let hasil = {
                _id: result._id,
                products: result.products,
                amount: result.amount,
                subtotal: result.subtotal,
                orders: result.orders
            }
            resolve([200, hasil, 'Order updated!'])
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to update product in order!'])
        }
    })
}

Order.removeProduct = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        try{
            let user = await User.findById(auth)
            let valid = user.profiles[0].toString();
            let detail = await Detail.findById(data)
            if(!detail) return reject([404, 'Detail not found!'])
            let orderId = detail.orders.toString();
            let order = await Order.findById(orderId)
            let profileId = order.profiles.toString();
            if(valid !== profileId) return reject([403, 'This is not your order!'])
            let product = await Product.findById(detail.products)
            
            product.stock += detail.amount
            product.save()
            order.total -= detail.subtotal
            order.save()

            Detail.findById(data)
            .populate('orders', '_id')
            .exec((err, hasil) => {
                Detail.findByIdAndDelete(hasil._id)
                    .then(
                        Order.updateOne(
                            { _id: orderId },
                            { $pullAll: { details: [data]} },
                            { safe: true, multi: true })
                                .then(result => {
                                    resolve([200, 'Product removed from detail!'])
                                })
                    )
            })
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to remove product from order!'])
        }
    })
}

Order.checkout = async function(auth, id) {
    return new Promise(async function(resolve,reject) {
        try {
            let order = await Order.findById(id)
            if(!order) return reject([404, 'Order not found!'])
            let orderId = order.profiles.toString();
            let user = await User.findById(auth)
            let profileId = user.profiles[0].toString();
            let profile = await Profile.findById(profileId)
            if(!profile) return reject([404, 'Profile not found!'])
            if(profileId !== orderId) return reject([403, 'This is not your order!'])
            let detailId = order.details[0].toString()
            let detail = await Detail.findById(detailId)
            if(!detail) return reject([400, 'Your cart is empty! Please order something first!'])
            let productId = detail.products.toString()
            let product = await Product.findById(productId)
            if(!product) return reject([404, 'Product not found!'])
            let merchantId = product.profiles.toString()
            let merchant = await Profile.findById(merchantId)
            if(!product) return reject([404, 'Product not found!'])
            let checkout = await Order.findByIdAndUpdate(id, {isDone: true})
            profile.histories.push(checkout)
            profile.save()
            merchant.histories.push(checkout)
            merchant.save()

            Order.findById(id)
            .populate('profiles', '_id')
            .exec((err, hasil) => {
                Order.findByIdAndDelete(hasil._id)
                    .then(
                        Profile.updateOne(
                            { _id: profileId },
                            { $pullAll: { orders: [id]} },
                            { safe: true, multi: true })
                                .then(result => {
                                    resolve([200, 'Thank you!'])
                                })
                    )
            })
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to confirm order!'])
        }
    })
}

module.exports = Order;
