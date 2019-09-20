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

    getOrderDetail(req, res) {
        Order.getOrder(req.user, req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    addProduct(req, res) {
        Order.addProduct(req.user, req.params.id, req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },
    getDetail(req, res) {
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
        Order.editProduct(req.user, req.params.id, req.body)
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
        Order.removeProduct(req.user, req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    checkout(req, res) {
        Order.checkout(req.user, req.params.id)
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