const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user.js');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Merchant','Buyer'],
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

profileSchema.plugin(uniqueValidator);
var Profile = mongoose.model('Profile', profileSchema)

Profile.makeProfile = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        Profile.create(data)
            .then(result => {
                User.findById(auth, (err, data) => {
                    data.profiles.push(result)
                    data.save();
                    result.users = auth
                    result.save( (err, res) => {
                        if(res.role == 'Merchant') {
                            let hasil = {
                                _id: res._id,
                                name: res.name,
                                role: res.role,
                                tags: res.tags,
                                products: res.products
                            }
                            resolve([201, hasil, 'Here is the detail!'])
                        }
                        else if(res.role == 'Buyer') {
                            let hasil = {
                                _id: res._id,
                                name: res.name,
                                role: res.role,
                                tags: res.tags,
                                orders: res.orders
                            }
                            resolve([201, hasil, 'Here is the detail!'])
                        }
                    })
                })
            })
            .catch(err => {
                reject([422, "Unexpected error! Failed to create profile!"])
            })
    })
}

Profile.editProfile = async function(auth, id, data, updated) {
    return new Promise(async function(resolve,reject) {
        Profile.findByIdAndUpdate(id, data, updated)
            .then(result => {
                resolve([200, result, 'Profile updated!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to update profile!'])
            })
    })
}

Profile.getShop = async function(data) {
    return new Promise(async function(resolve,reject) {
        Profile.findOne(data)
            .then(result => {
                let hasil = {
                    name: result.name,
                    role: result.role,
                    tags: result.tags,
                    products: result.products
                }
                resolve([200, hasil, 'Here is the detail!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to get merchant list!'])
            })
    })
}

Profile.getProfile = async function(id) {
    return new Promise(async function(resolve,reject) {
        Profile.findById(id)
            .then(result => {
                if(result.role == 'Merchant') {
                    let hasil = {
                        name: result.name,
                        role: result.role,
                        tags: result.tags,
                        products: result.products
                    }
                    resolve([200, hasil, 'Here is the detail!'])
                }
                else if(result.role == 'Buyer') {
                    let hasil = {
                        name: result.name,
                        role: result.role,
                        tags: result.tags,
                        orders: result.orders
                    }
                    resolve([200, hasil, 'Here is the detail!'])
                }
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to get profile!'])
            })
    })
}

module.exports = Profile;