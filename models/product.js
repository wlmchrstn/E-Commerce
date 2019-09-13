const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
});

productSchema.plugin(uniqueValidator);
var Product = mongoose.model('Product', productSchema)

Product.createProduct = async function(data) {
    return new Promise(async function(resolve, reject) {

        let product = await Product.findOne({
            name: data.name
        }).select(['_id', 'name', 'price', 'categories'])
        if(product) {
            return reject ([400, "Product is already available!"])
        }

        Product.create(data)
            .then(result => {
                resolve([201, result, 'Product created'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to create product!'])
            })
    })
}

Product.getAllProduct = async function(data) {
    return new Promise(async function(resolve, reject) {
        Product.find(data)
            .then(result => {
                resolve([200, result, 'Here is the list!'])
            })
            .catch(err => {
                reject([422, "Unexpected error! Can't get product list!"])
            })
    })
}

Product.editProduct = async function(id, data) {
    return new Promise(async function(resolve, reject) {
        Product.findByIdAndUpdate(id, data)
            .then(result => {
                resolve([200, result, 'Product updated!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to update product!'])
            })
    })
}

Product.removeProduct = async function(data) {
    return new Promise(async function(resolve, reject) {
        Product.findByIdAndDelete(data)
            .then(result => {
                resolve([200, 'Product deleted!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to delete product!'])
            })
    })
}

module.exports = Product;
