const Profile = require('../models/profile.js');
const { success, error } = require('../helper/resformat.js');

module.exports = {
    create(req, res) {
        Profile.makeProfile(req.user, req.body)
            .then(result => {
                result.unshift(res)
                success(result)                
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },
   
    update(req, res) {
        let data = { new: true };
            Profile.editProfile(req.user, {name: req.body.name, tags: req.body.tags}, data)
                .then(result => {
                    result.unshift(res)
                    success(result)
                })
                .catch(err => {
                    err.unshift(res)
                    error(err)
                })
    },
    show(req, res) {
        Profile.getProfile(req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
    },
    
    history(req, res) {
        Profile.checkHistories(req.user)
            .then(result => {
                result.unshift(res)
                success(result)
            })
    }
}
