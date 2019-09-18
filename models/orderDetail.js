const mongoose = require('mongoose');
const Order = require('./order.js');
const Product = require('./product.js');

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

Detail.addProduct = async function(auth, id, data) {
    return new Promise(async function(resolve,reject) {
        try {
            Product.findById(data.products)
                .then(product => {
                    Detail.create(data)
                    .then(result => {
                        Order.findById(id, (err, hasil) => {
                            result.subtotal = (result.amount * product.price)
                            hasil.details.push(result)
                            hasil.save()
                            result.orders = id
                            result.save( (err, res) => {
                                let hasil = {
                                    _id: res._id,
                                    products: res.products,
                                    amount: res.amount,
                                    subtotal: res.subtotal,
                                    orders: res.orders
                                }
                                resolve([201, res, 'Product added!'])
                            })
                        })
                    })
                })
                .catch(err => {
                    reject([400, "Bad Request! Failed to add product!"])
                })
        }
        catch (err) {
            reject([422, 'Unexpected error! Failed to add product!'])
        }
    })
}

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

Detail.updateProduct = async function(auth, id, data) {
    return new Promise(async function(resolve,reject) {
        let valid = await Detail.findById(id)
        if(!valid) return reject([404, 'Order detail not found!'])
        try{
            let updated = { new: true };
            let detail = await Detail.findById(id)
            let product = await Product.findById(detail.products)
            let subtotal = (data.amount * product.price)
            let baru = {
                _id: detail._id,
                amount: data.amount,
                products: detail.products,
                __v: detail.__v,
                subtotal: subtotal,
                orders: detail.orders
            }
            Detail.findByIdAndUpdate(id, {$set: baru}, updated)
                .then(result => {
                    let hasil = {
                        _id: result._id,
                        products: result.products,
                        amount: result.amount,
                        subtotal: result.subtotal,
                        orders: result.orders
                    }
                    resolve([200, hasil, 'Order updated!'])
                })
                .catch(err => {
                    reject([400, 'Bad Request! Failed to update order!'])
                })
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to update detail!'])
        }
    })
}

Detail.removeProduct = async function(auth, data) {
    return new Promise(async function(resolve, reject) {
        let valid = await Detail.findById(data)
        let id = valid.orders.toString();
        if(!valid) return reject([404, 'Order detail not found!'])
        try{
            Detail.findById(data)
            .populate('orders', '_id')
            .exec((err, hasil) => {
                Detail.findByIdAndDelete(hasil._id)
                    .then(
                        Order.updateOne(
                            { _id: id },
                            { $pullAll: { details: [data]} },
                            { safe: true, multi: true })
                                .then(result => {
                                    resolve([200, 'Product removed from detail!'])
                                })
                    )
            })
        }
        catch(err) {
            reject([422, 'Unexpected error! Failed to remove product from detail!'])
        }
    })
}

module.exports = Detail;
