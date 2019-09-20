process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const Order = require('../models/order.js');
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
const Detail = require('../models/orderDetail.js');
const Product = require('../models/product.js');
chai.use(chaiHttp)

describe('ORDER OPERATION', ()=> {
    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype5",
                email: "prototype5",
                password: "prototype5"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "prototype5",
                password: "prototype5"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                merchantToken = `Bearer ${res.body.result.token}`
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', merchantToken)
            .send({
                name: "prototype5",
                role: "Merchant",
                tags: "Food"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                merchantId = res.body.result._id.toString()
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/product/create')
            .set('authorization', merchantToken)
            .send({
                name: "Kopi",
                description: "Indie banged",
                price: 2000,
                stock: 100
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                productId = res.body.result._id.toString()
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype6",
                email: "prototype6",
                password: "prototype6"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "prototype6",
                password: "prototype6"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                buyerToken = `Bearer ${res.body.result.token}`
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', buyerToken)
            .send({
                name: "prototype6",
                role: "Buyer",
                tags: "Beverage"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                buyerId = res.body.result._id.toString()
                done();
            })
    })

    after(done => {
        Profile.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                console.log(err)
            })
    })

    after(done => {
        User.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                console.log(err)
            })
    })

    after(done => {
        Product.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                console.log(err)
            })
    })

    after(done => {
        Order.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                console.log(err)
            })
    })

    after(done => {
        Detail.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                console.log(err)
            })
    })

    it('DB Connect', (done)=> {
        chai.request(app)
            .get('/')
            .send()
            .end((err, res)=> {
                expect(res.body.success).to.equal(true)
                done()
            })
    })

    it('Invalid role', (done)=> {
        chai.request(app)
            .post('/api/order/create')
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done();
            })
    })

    it('Order created', (done)=> {
        chai.request(app)
            .post('/api/order/create')
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                orderId = res.body.result._id.toString()
                done();
            })
    })

    it('Failed to get order', (done)=> {
        chai.request(app)
            .get(`/api/order/detail/${buyerId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .get(`/api/order/detail/${orderId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .get(`/api/order/detail/${orderId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Order not found', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${buyerId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', merchantToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Product not found', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: buyerId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Blank amount', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 0,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done()
            })
    })

    it('Out of stock', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 1000,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done()
            })
    })

    it('Product added', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                detailId = res.body.result.details[0]._id
                done()
            })
    })

    it('Bad request', (done)=> {
        chai.request(app)
            .get(`/api/order/order-detail/${orderId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done()
            })
    })

    it('Here is the detail', (done)=> {
        chai.request(app)
            .get(`/api/order/order-detail/${detailId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Duplicate product', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done()
            })
    })

    it('Detail not found', (done)=> {
        chai.request(app)
            .put(`/api/order/update-order-detail/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .put(`/api/order/update-order-detail/${detailId}`)
            .set('authorization', merchantToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Blank name', (done)=> {
        chai.request(app)
            .put(`/api/order/update-order-detail/${detailId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 0,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done()
            })
    })

    it('Out of stock', (done)=> {
        chai.request(app)
            .put(`/api/order/update-order-detail/${detailId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 1000,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done()
            })
    })

    it('Out of stock', (done)=> {
        chai.request(app)
            .put(`/api/order/update-order-detail/${detailId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 15,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Detail not found', (done)=> {
        chai.request(app)
            .delete(`/api/order/remove-product/${orderId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .delete(`/api/order/remove-product/${detailId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Product removed', (done)=> {
        chai.request(app)
            .delete(`/api/order/remove-product/${detailId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Order not found', (done)=> {
        chai.request(app)
            .post(`/api/order/checkout/${detailId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid order owner', (done)=> {
        chai.request(app)
            .post(`/api/order/checkout/${orderId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Product added', (done)=> {
        chai.request(app)
            .post(`/api/order/add-product/${orderId}`)
            .set('authorization', buyerToken)
            .send({
                amount: 10,
                products: productId
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                detailId = res.body.result.details[0]._id
                done()
            })
    })

    it('Checkout', (done)=> {
        chai.request(app)
            .post(`/api/order/checkout/${orderId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Order created', (done)=> {
        chai.request(app)
            .post('/api/order/create')
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                orderId = res.body.result._id.toString()
                done();
            })
    })

    it('Order not found!', (done)=> {
        chai.request(app)
            .delete(`/api/order/delete/${merchantId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done();
            })
    })

    it('Invalid order owner!', (done)=> {
        chai.request(app)
            .delete(`/api/order/delete/${orderId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done();
            })
    })

    it('Order deleted!', (done)=> {
        chai.request(app)
            .delete(`/api/order/delete/${orderId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })
})