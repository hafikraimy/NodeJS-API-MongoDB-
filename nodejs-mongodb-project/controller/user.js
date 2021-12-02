const bcrypt = require('bcrypt');
const {User} = require('../models/dbModel/user');
const {validateRegister, validateLogin, validateLogout, validateGetProfile, validateUpdateProfile} = require('../models/validation/validate-controller');
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const _ = require('lodash');
const { date } = require('joi');

//register new user
router.post('/register', async (req, res) => {
    const {error} = validateRegister(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username});
    if(user) return res.status(400).send('Username already registered');

    user = new User(_.pick(req.body, ['username', 'displayUsername', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.token = '';
    await user.save();

    const token = user.generateAuthToken();
    req.header('Content-Type', 'application/json');
    res.json({
        token: token,
        displayUsername: user.displayUsername,
        userId: user._id
    });
});

//login user
router.post('/session/login', async (req, res) => {
    const {error} = validateLogin(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username});
    if(!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid username or password.');

    user.token = user.generateAuthToken();
    await user.save();

    req.header('Content-Type', 'application/json');
    res.json({
        token: user.token,
        displayUsername: user.displayUsername,
        userId: user._id
    });
});

//logout user
router.post('/session/logout', authenticateToken, async(req, res) => {
    const {error} = validateLogout(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const authHeader = req.header('Authorization');
    const token = authHeader.substring(7, authHeader.length);

    let user = await User.findOne({ token: token});
    if(!user) return res.status(400).send('Invalid token.');

    if(!token === user.token)
        return res.status(400).send('Invalid token.');

    user.token = "";
    await user.save();

    req.header('Content-Type', 'application/json');   
    res.status(200).send('');
});

//get user profile
router.post('/getProfile', authenticateToken, async(req, res) => {
    const {error} = validateGetProfile(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id).select('-password');

    const authHeader = req.header('Authorization');
    if(!authHeader.substring(7, authHeader.length) === user.token)
        return res.status(400).send('Invalid token.');

    req.header('Content-Type', 'application/json');
    res.json({
        username: user.username,
        displayUsername: user.displayUsername,
        userId: user._id
    });
});

//update user profile
router.post('/updateProfile', authenticateToken, async(req, res) => {
    const {error} = validateUpdateProfile(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.user._id, { $set: { displayUsername: req.body.displayUsername }}, { new: true });
    if(!user) return res.status(404).send('User was not found.')

    const authHeader = req.header('Authorization');
    if(!authHeader.substring(7, authHeader.length) === user.token)
        return res.status(400).send('Invalid token.');

    req.header('Content-Type', 'application/json');
    res.json({
        username: user.username,
        displayUsername: user.displayUsername,
        userId: user._id
    });
});

module.exports = router;
