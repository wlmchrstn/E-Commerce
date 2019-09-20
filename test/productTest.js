process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const Product = require('../models/product.js');
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
chai.use(chaiHttp)

describe('PRODUCT OPERATION', ()=> {
    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype3",
                email: "prototype3",
                password: "prototype3"
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
                username: "prototype3",
                password: "prototype3"
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
                name: "prototype3",
                role: "Merchant",
                tags: "Food"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                merchantId = res.body.result._id.toString()
                done()
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype4",
                email: "prototype4",
                password: "prototype4"
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
                username: "prototype4",
                password: "prototype4"
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
                name: "prototype4",
                role: "Buyer",
                tags: "Beverage"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                buyerId = res.body.result._id.toString()
                done()
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

    it('Not a Merchant', (done)=> {
        chai.request(app)
            .post('/api/product/create')
            .set('authorization', buyerToken)
            .send({
                name: "Kopi",
                description: "Ngopi bray",
                price: 5000,
                stock: 20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Bad Request', (done)=> {
        chai.request(app)
            .post('/api/product/create')
            .set('authorization', merchantToken)
            .send({
                description: "Ngopi bray",
                price: 5000,
                stock: 20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done()
            })
    })

    it('Product created!', (done)=> {
        chai.request(app)
            .post('/api/product/create')
            .set('authorization', merchantToken)
            .send({
                name: "Kopi",
                description: "Ngopi bray",
                price: 5000,
                stock: 20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                productId = res.body.result._id.toString()
                done()
            })
    })

    it('Get All Product!', (done)=> {
        chai.request(app)
            .get('/api/product/list')
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Search', (done)=> {
        chai.request(app)
            .get('/api/product/search?name=Kopi')
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Product not found!', (done)=> {
        chai.request(app)
            .get(`/api/product/detail/${buyerId}`)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Here is the detail!', (done)=> {
        chai.request(app)
            .get(`/api/product/detail/${productId}`)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })
    
    it('Product not found!', (done)=> {
        chai.request(app)
            .put(`/api/product/update/${buyerId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid product owner', (done)=> {
        chai.request(app)
            .put(`/api/product/update/${productId}`)
            .set('authorization', buyerToken)
            .send({
                name: "ABC",
                description: "ABC",
                price: 30,
                stock:20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Blank Name', (done)=> {
        chai.request(app)
            .put(`/api/product/update/${productId}`)
            .set('authorization', merchantToken)
            .send({
                name: "",
                description: "ABC",
                price: 30,
                stock:20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done()
            })
    })

    it('Product updated!', (done)=> {
        chai.request(app)
            .put(`/api/product/update/${productId}`)
            .set('authorization', merchantToken)
            .send({
                name: "ABC",
                description: "ABC",
                price: 30,
                stock:20
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('Product not found!', (done)=> {
        chai.request(app)
            .delete(`/api/product/delete/${buyerId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('Invalid product owner', (done)=> {
        chai.request(app)
            .delete(`/api/product/delete/${productId}`)
            .set('authorization', buyerToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('Product deleted!', (done)=> {
        chai.request(app)
            .delete(`/api/product/delete/${productId}`)
            .set('authorization', merchantToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })
})
