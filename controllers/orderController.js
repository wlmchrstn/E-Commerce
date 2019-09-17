const Order = require('../models/order.js');
const { success, error } = require('../helper/resformat.js');

module.exports = {
    addOrder(req, res) {
        Order.addOrder(req.user, req.params.id, {})
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    deleteOrder(req, res) {
        Order.removeOrder(req.user, req.params.id, req.params.order)
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