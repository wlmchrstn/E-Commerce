const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Profile = require('./profile.js')
const _ = require('lodash');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

productSchema.plugin(uniqueValidator);
var Product = mongoose.model('Product', productSchema)

Product.createProduct = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {

        let notValid = await Product.findOne({
            name: data.name
        })
        if(notValid) {
            return reject ([400, "Product is already available!"])
        }

        Product.create(data)
            .then(result => {
                Profile.findById(id, (err, hasil) => {
                    hasil.products.push(result)
                    hasil.save();
                    result.users = id
                    result.save((err,res) => {
                        resolve([201, res, 'Product created'])
                    })
                })
            })
            .catch(err => {
                reject([422, err, 'Unexpected error! Failed to create product!'])
            })
    })
}

Product.All = async function(data) {
    return new Promise(async function(resolve, reject) {
        Product.find(data)//.select(['_id', 'name', 'price', 'stock'])
            .then(result => {
                resolve([200, result, 'Here is the list!'])
            })
            .catch(err => {
                reject([422, "Unexpected error! Failed to get list by category!"])
            })
    })
}

Product.editProduct = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        Product.findByIdAndUpdate(id, data)
            .then(result => {
                resolve([200, 'Product updated!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to update product!'])
            })
    })
}

Product.removeProduct = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        Product.findById(data)
            .populate('profiles', '_id')
            .exec((err, hasil) => {
                Product.findByIdAndDelete(hasil._id)
                    .then(
                        Profile.updateOne(
                            { _id: id },
                            { $pullAll: { products: [data]} },
                            { safe: true, multi: true })
                                .then(result => {
                                    resolve([200, 'Product deleted!'])
                                })
                                .catch(err => {
                                    reject([422, 'Unexpected error! Failed to delete product!'])
                                })
                    )
            })
    })
}

module.exports = Product;
