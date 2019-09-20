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
    }],
    histories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

profileSchema.plugin(uniqueValidator);
var Profile = mongoose.model('Profile', profileSchema)

Profile.makeProfile = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        // try {
            let valid = await User.findById(auth)
            if(valid.profiles[0] !== undefined) return reject([409, 'Profile already created!'])
            Profile.create(data)
                .then(result => {
                    User.findById(auth, (err, data) => {
                        data.profiles.push(result)
                        data.save();
                        result.users = auth
                        result.save((err, res) => {
                            if(res.role == 'Merchant') {
                                let hasil = {
                                    _id: res._id,
                                    name: res.name,
                                    role: res.role,
                                    tags: res.tags,
                                    products: res.products
                                }
                                resolve([201, hasil, 'Profile created!'])
                            }
                            else if(res.role == 'Buyer') {
                                let hasil = {
                                    _id: res._id,
                                    name: res.name,
                                    role: res.role,
                                    tags: res.tags,
                                    orders: res.orders
                                }
                                resolve([201, hasil, 'Profile created!'])
                            }
                        })
                    })
                })
                .catch(err => {
                    reject([400, 'Bad request! Failed to create profile!'])
                })
        // }
        // catch(err) {
        //     reject([422, "Unexpected error! Failed to create profile!"])
        // }
    })
}

Profile.editProfile = async function(auth, data, updated) {
    return new Promise(async function(resolve,reject) {
        try {
            let valid = (data.name)
            if(valid == null || valid == "") return reject([400, "Failed to updated! Name can't be blank!"])
            let user = await User.findById(auth)
            let id = user.profiles[0].toString()
            let yes = await Profile.findById(id)
            if(!yes) return reject([422, 'Unexpected error! Please create profile first!'])
            let result = await Profile.findByIdAndUpdate(id, data, updated)
                if(result.role == 'Merchant') {
                    let hasil = {
                        _id: result._id,
                        name: result.name,
                        role: result.role,
                        tags: result.tags,
                        products: result.products
                    }
                    resolve([200, hasil, 'Profile updated!'])
                }
                else if(result.role == 'Buyer') {
                    let hasil = {
                        _id: result._id,
                        name: result.name,
                        role: result.role,
                        tags: result.tags,
                        orders: result.orders
                    }
                    resolve([200, hasil, 'Profile updated!'])
                }
        }
        catch(err){
            reject([422, 'Unexpected error! Failed to update profile!'])
        }
    })
}

Profile.getProfile = async function(id) {
    return new Promise(async function(resolve,reject) {
        let result = await Profile.findById(id).populate('products')
        if(!result) return reject([404, 'Profile not found!'])
        if(result.role == 'Merchant') {
            let hasil = {
                name: result.name,
                role: result.role,
                tags: result.tags,
                products: result.products,
                histories: result.histories
            }
            resolve([200, hasil, 'Here is the detail!'])
        }
        else if(result.role == 'Buyer') {
            let hasil = {
                name: result.name,
                role: result.role,
                tags: result.tags,
                orders: result.orders,
                histories: result.histories
            }
            resolve([200, hasil, 'Here is the detail!'])
        }
    })
}

Profile.checkHistories = async function(auth) {
    return new Promise(async function(resolve,reject) {
            let user = await User.findById(auth)
            let profileId = user.profiles[0].toString()
            let profile = await Profile.findById(profileId).populate('histories')
            let hasil = {
                _id: profile._id,
                name: profile.name,
                role: profile.role,
                histories: profile.histories
            }
            if(profile) return resolve([200, hasil, 'Here is the detail!'])
    })
}

module.exports = Profile;