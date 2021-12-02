const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
require("./controller/routes")(app);

if(!config.get('jwtPrivateKey')){
    console.log('FATAL error: jwtPrivateKey is not defined.');
    process.exit(1);}

mongoose.connect('mongodb://localhost/usersDB')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to mongoDB...'. err));

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));