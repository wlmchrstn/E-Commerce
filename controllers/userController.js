const User = require('../models/user.js');
const { success, error } = require('../helper/resformat.js');

module.exports = {

    create(req, res) {    
        User.register(req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    login(req, res) {
        User.login(req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    detail(req, res) {
        User.detail(req.user)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    }
}
