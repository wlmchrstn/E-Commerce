process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const Profile = require('../models/profile.js')
const User = require('../models/user.js');
chai.use(chaiHttp)

describe('PROFILE OPERATION', ()=> {
    
    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype",
                email: "prototype",
                password: "prototype"
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
                username: "prototype",
                password: "prototype"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                merchantToken = `Bearer ${res.body.result.token}`
                done();
            })
    })

    before(done => {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype2",
                email: "prototype2",
                password: "prototype2"
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
                username: "prototype2",
                password: "prototype2"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                buyerToken = `Bearer ${res.body.result.token}`
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

    it('Failed to create profile!', (done)=> {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', merchantToken)
            .send({
                name:{},
                role:"Merchant",
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done();
            })
    })

    it('Please create profile first!', (done)=> {
        chai.request(app)
            .put('/api/profile/update')
            .set('authorization', merchantToken)
            .send({
                name:"Toko baru",
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it('Should create Merchant profile', (done)=> {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', merchantToken)
            .send({
                name:"Toko",
                role:"Merchant",
                tags:"Technology"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                merchantId = res.body.result._id.toString()
                done();
            })
    })

    it('Profile already created!', (done)=> {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', merchantToken)
            .send({
                name:"Toko",
                role:"Merchant",
                tags:"Technology"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(409)
                done();
            })
    })

    it('Name cant be blank!', (done)=> {
        chai.request(app)
            .put('/api/profile/update')
            .set('authorization', merchantToken)
            .send({
                name:"",
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done();
            })
    })
    
    it('Failed to update profile!', (done)=> {
        chai.request(app)
            .put('/api/profile/update')
            .set('authorization', merchantToken)
            .send({
                name:{},
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it('Should update Merchant profile', (done)=> {
        chai.request(app)
            .put('/api/profile/update')
            .set('authorization', merchantToken)
            .send({
                name:"Toko baru",
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it('Should create Buyer profile', (done)=> {
        chai.request(app)
            .post('/api/profile/create')
            .set('authorization', buyerToken)
            .send({
                name:"Pembeli",
                role:"Buyer",
                tags:"Technology"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                done();
            })
    })

    it('Should update Buyer profile', (done)=> {
        chai.request(app)
            .put('/api/profile/update')
            .set('authorization', buyerToken)
            .send({
                name:"Pembeli baru",
                tags:"Technology baru"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                buyerId = res.body.result._id.toString()
                done();
            })
    })

    it('Should get Merchant profile', (done)=> {
        chai.request(app)
            .get(`/api/profile/show/${merchantId}`)
            .set('authorization', merchantToken)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it('Should get Buyer profile', (done)=> {
        chai.request(app)
            .get(`/api/profile/show/${buyerId}`)
            .set('authorization', buyerToken)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it('Should get Buyer and Merchant histories', (done)=> {
        chai.request(app)
            .get('/api/profile/history')
            .set('authorization', buyerToken)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })
})