const mongoose = require('mongoose');

const carDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const carModelsSchema = new mongoose.Schema({
    carname: { type: String, required: true},
    brand: { type: String, required: true },
    description: { type: String, required: true },
    variance: [carDetailsSchema]
});

const CarList = mongoose.model('CarList', carModelsSchema);

exports.CarList = CarList;
