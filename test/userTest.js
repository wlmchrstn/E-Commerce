process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const User = require('../models/user.js');
chai.use(chaiHttp)

describe('USER OPERATION', ()=> {

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
                token = `Bearer ${res.body.result.token}`
                done();
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

    it('It should create an user', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "test001",
                email: "test001@mail.com",
                password: "test001"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(201)
                done();
            })
    })

    it('It should login user', (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "test001",
                password: "test001"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it('It should get user detail', (done)=> {
        chai.request(app)
            .get('/api/user/info')
            .set('authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            })
    })
    // NEGATIVE CASE
    it('Username already taken', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "test001",
                email: "dupe",
                password:"dupe"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it('Email already taken', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "dupe",
                email: "test001@mail.com",
                password:"dupe"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })
    
    it('Failed to create user', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                name: "dupe",
                emaail: "dupe",
                pwd: "dupe"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it('Failed to login', (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "dupe"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it("User hasn't registered yet!", (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "abc",
                password: "abc"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done();
            })
    })

    it('Password incorrect!', (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "test001",
                password: "abc"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done();
            })
    })

    it("Please insert token", (done) => {
        chai.request(app)
            .get('/api/user/info')
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(401)
                done();
            })
    })
    
    it("Invalid token", (done) => {
        chai.request(app)
            .get('/api/user/info')
            .set('authorization', 'Bearer token')
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(403)
                done();
            })
    })
})
