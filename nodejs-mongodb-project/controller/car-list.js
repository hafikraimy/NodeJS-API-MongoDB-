const express = require('express');
const {CarList} = require('../models/dbModel/carList');
const {User} = require('../models/dbModel/user');
const {validateCarList} = require('../models/validation/validate-controller');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

//get car list
router.post('/', authenticateToken, async (req, res) => {
    const {error} = validateCarList(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let dateTime = new Date();
    console.log(dateTime);
    const totalRecords = await CarList.countDocuments({});

    const carList = await CarList.find({ carname: {$regex: req.body.carname, $options: 'i'}})
        .skip((req.body.pageindex - 1) * req.body.pagesize)
        .limit(req.body.pagesize);

    if(!carList) return res.status(400).send('"Carname" not found');

    const authHeader = req.header('Authorization');
    const token = authHeader.substring(7, authHeader.length);
    let user = await User.findOne({ token: token});
    if(!user) return res.status(400).send('Invalid token.');

    if(!token === user.token)
        return res.status(400).send('Invalid token.');

    req.header('Content-Type', 'application/json');
    res.json({
        list: carList,
        totalCount: totalRecords
    });
});

module.exports = router;