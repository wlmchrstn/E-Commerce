const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Profile = require('./profile.js')

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
    },
    profiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

productSchema.plugin(uniqueValidator);
var Product = mongoose.model('Product', productSchema)

Product.createProduct = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        let valid = await Profile.findById(id)
        if(valid.role !== 'Merchant') return reject([403, 'Failed to create product! You are not a Merchant!'])

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
Product.detail = async function(id) {
    return new Promise(async function(resolve,reject) {
        Product.findById(id)
            .select(['_id','name','price','stock'])
            .then(result => {
                resolve([200, result, 'Here is the detail!'])
            })
            .catch(err => {
                reject([422, 'Failed to get product detail!'])
            })
    })
}

Product.editProduct = async function(auth, id, data, updated) {
    return new Promise(async function(resolve,reject) {
        Product.findByIdAndUpdate(id, data)
            .then(result => {
                resolve([200, result, 'Product updated!'])
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
