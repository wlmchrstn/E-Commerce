const Product = require('../models/product.js');
const { success, error } = require('../helper/resformat.js');

module.exports = {
    createProduct(req, res) {
        Product.createProduct(req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    getProduct(req, res) {
        Product.getAllProduct({})
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    editProduct(req, res) {
        Product.editProduct(req.params.id, req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    deleteProduct(req, res) {
        Product.removeProduct(req.params.id)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                success(err)
            })
    }
}