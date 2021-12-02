const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const authHeader = req.header('Authorization');
    if(!authHeader.startsWith('Bearer ')) return res.status(401).send('Token must start with Bearer');

    const token = authHeader.substring(7, authHeader.length);
    if(!token) return res.status(401).send('Access denied. No token provided.')
    
    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token.');
    }
}