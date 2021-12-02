const Joi = require('joi');

function validateRegister(req){
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        displayUsername: Joi.string().min(5).max(200).required(),
        password: Joi.string().min(5).max(100).required(),
        timestamp: Joi.date().iso().required()
    });
    return schema.validate(req);
};

function validateLogin(req){
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(5).max(100).required(),
        timestamp: Joi.date().iso().required()
    });
    return schema.validate(req);
};

function validateLogout(req){
    const schema = Joi.object({ 
        timestamp: Joi.date().iso().required() 
    });
    return schema.validate(req);
};

function validateGetProfile(req){
    const schema = Joi.object({ timestamp: Joi.date().iso().required()  });
    return schema.validate(req);
};

function validateUpdateProfile(req){
    const schema = Joi.object({
        displayUsername: Joi.string().min(4).max(200).required(),
        timestamp: Joi.date().iso().required() 
    });
    return schema.validate(req);
};

function validateCarList(req){
    const schema = Joi.object({
        carname: Joi.string().allow(null).allow('').required(),
        pageindex: Joi.number().min(1).max(100).required(),
        pagesize: Joi.number().min(1).max(100).required(),
        timestamp: Joi.date().iso().required() 
    });
    return schema.validate(req);
};

module.exports = {
    validateRegister,
    validateLogin,
    validateLogout,
    validateGetProfile,
    validateUpdateProfile,
    validateCarList
};
