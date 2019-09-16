const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user.js');

const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'Merchant'
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
    }]
})

merchantSchema.plugin(uniqueValidator);
var Merchant = mongoose.model('Merchant', profileSchema)

Merchant.makeProfile = async function(auth, data) {
    return new Promise(async function(resolve,reject) {
        Merchant.create(data)
            .then(result => {
                User.findById(auth, (err, data) => {
                    data.profiles.push(result)
                    data.save();
                    result.users = auth
                    result.save( (err, res) => {
                        resolve([201, res, 'Profile created!'])
                    })
                })
            })
            .catch(err => {
                reject([422, err, "Unexpected error! Failed to create profile!"])
            })
    })
}

Merchant.editProfile = async function(auth, id, data, updated) {
    return new Promise(async function(resolve,reject) {
        Merchant.findByIdAndUpdate(id, data, updated)
            .then(result => {
                resolve([200, result, 'Profile updated!'])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to update profile!'])
            })
    })
}

module.exports = Profile;