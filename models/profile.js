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
                        resolve([201, res, 'Profile created!'])
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

module.exports = Profile;