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
    preview: {
        type: String,
        required: false
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
        try {
            Product.create(data)
            .then(result => {
                Profile.findById(id, (err, hasil) => {
                    hasil.products.push(result)
                    hasil.save();
                    result.profiles = id
                    result.save((err,res) => {
                        let ay = {
                            _id: res._id,
                            name: res.name,
                            price: res.price,
                            stock: res.stock,
                            profiles: res.profiles
                        }
                        resolve([201, ay, 'Product created!'])
                    })
                })
            })
            .catch(err => {
                reject([400, 'Bad Request! Failed to create product!'])
            })
        }
        catch(err) {
            reject([422, 'Unexpected error! Failed to create product!'])
        }
    })
}

Product.getAll = async function(data) {
    return new Promise(async function(resolve,reject) {
        let all = await Product.find(data).select(['_id','name','price','stock','preview'])
        if(!all) {
            reject([404, 'Product not found!'])
        }
        else if(all) {
            resolve([200, all, 'Here is the list!'])
        }
    })
}

Product.detail = async function(id) {
    return new Promise(async function(resolve,reject) {
        let valid = await Product.findById(id).select(['_id','name','price','stock','preview'])
        if(!valid) {
            reject([404, 'Product not found!'])
        }
        else if(valid) {
            resolve([200, valid, 'Here is the detail!'])
        }
    })
}

Product.editProduct = async function(auth, id, data, updated) {
    return new Promise(async function(resolve,reject) {
        let valid = await Product.findById(id)
        if(!valid) return reject([404, 'Product not found!'])
        if(valid.profiles !== auth._id) return reject([403, 'This is not your product!'])
        try{
            let update = await Product.findByIdAndUpdate(id, data)
            if(update.name == null || update.name == "") return reject([400, "Failed to update! Name can't be blank"])
            if(update) {
                let hasil = {
                    _id: update._id,
                    name: update.name,
                    price: update.price,
                    stock: update.stock,
                    profiles: update.profiles
                }
                resolve([200, hasil, 'Product updated!'])
            }
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to update product!'])
        }
    })
}

Product.removeProduct = async function(auth, id, data) {
    return new Promise(async function(resolve, reject) {
        let valid = await Product.findById(data)
        if(!valid) return reject([404, 'Product not found!'])
        if(valid.profiles !== auth._id) return reject([403, 'This is not your product!'])
        try{
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
                    )
            })
        }
        catch(err) {
            reject([422, 'Unexpected error! Failed to delete product!'])
        }
    })
}

module.exports = Product;
