const Order = require('../models/order.js');
const { success, error } = require('../helper/resformat.js');
const Detail = require('../models/orderDetail.js');

module.exports = {
    addOrder(req, res) {
        Order.addOrder(req.user, {})
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
        Order.removeOrder(req.user, req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    addToOrder(req, res) {
        Detail.addProduct(req.user, req.params.id, req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },
    
    getOrderDetail(req, res) {
        Detail.getDetail(req.user, req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    editProductOrder(req, res) {
        Detail.updateProduct(req.user, req.params.id, req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    removeProductOrder(req, res) {
        Detail.removeProduct(req.user, req.params.id)
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