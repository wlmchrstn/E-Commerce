const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }]
})

userSchema.plugin(uniqueValidator);
var User = mongoose.model('User', userSchema)

User.generateHash = function(data) {
    let salt = 10
    return bcrypt.hashSync(data, salt)
}

User.register = async function(data) {
    return new Promise(async function(resolve, reject) {
        if(!data.username || !data.email || !data.password) {
            return reject([422, 'Unexpected error! Failed to create user!'])
        }

        let salt = 10;
        let pwd = await bcrypt.hash(data.password, salt)

        let userUsername = await User.findOne({ username: data.username})
        if (userUsername) return reject([422, `${data.username} is already taken!`])
        
        let userEmail = await User.findOne({ email: data.email })
        if (userEmail) return reject([422, `${data.email} is already registered!`])
        
        User.create({
            username: data.username,
            email: data.email,
            password: pwd
            })
            .then(user => {
                resolve([
                    201,
                    {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                    },
                    'User created!'
            ])
            })
            .catch(err => {
                reject([422, 'Unexpected error! Failed to create user!'])
            })
    })
}

User.login = async function(data) {
    return new Promise(async function(resolve,reject) {
        if(!data.username || !data.password) {
            return reject([422, 'Unexpected error! Failed to login!'])
        }

        let user = await User.findOne({
            username: data.username
        }).select(['_id', 'username', 'password'])
        if(!user) {
            return reject ([404, "User hasn't registered yet!"])
        }

        let isCorrect = await bcrypt.compare(data.password, user.password)
        if(!isCorrect) {
            return reject([403, "Password incorrect!"])
        }
        
        let token = jwt.sign({_id: user._id}, process.env.DBLOGIN)
        resolve([200, {token: token}, 'Token created!'])
    })
}

User.detail = async function(data) {
    return new Promise(async function(resolve,reject) {
        User.findById(data)
            .select(['username','_id','profiles'])
            .populate({
                path: 'profile',
                select: ['name','role','tags','users']
            })
            .then(result => {
                resolve([200, result, 'Here is the details!'])
            })
    })
}

module.exports = User;
