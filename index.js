const express = require('express');
const parser = require('body-parser');
const server = express();
const config = require('./config/config');

server.use(parser.json());

const dbConfig = require('./config/db');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url,{useNewUrlParser: true}).then(() => {
    console.log("Connected to the database");
}).catch((error) => {
    console.log("Couldn't connect to the database. Exiting now...");
    process.exit();
});
server.get('/', (request, response) => { 
    response.json({"message":"Welcome"});
});

server.listen(config.port, () => {
    console.log("Server is listening at port " + config.port);
});
