const jwt = require('jsonwebtoken');
const { success, error } = require('./resFormatter')

module.exports = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) return res.status(401).json( error('Please insert token!') )
    
    const spt = token.split(" ")
    
    try {
        const verified = jwt.verify(spt[1], process.env.DBLOGIN);
        req.user = verified
        next();
    }
    catch(err) { 
        res.status(403).json( error('Invalid token!') )
    }
}
