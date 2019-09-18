const Product = require('../models/product.js');
const { success, error } = require('../helper/resformat.js');

module.exports = {
    createProduct(req, res) {
        Product.createProduct(req.user, req.body)
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },

    getAllProduct(req, res) {
        Product.getAll({})
            .then(result => {
                result.unshift(res)
                success(result)
            })
            .catch(err => {
                err.unshift(res)
                error(err)
            })
    },
    
    getProductDetail(req, res) {
        Product.detail(req.params.id)
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
        Product.editProduct(req.user, req.params.id, req.body)
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
        Product.removeProduct(req.user, req.params.id)
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
