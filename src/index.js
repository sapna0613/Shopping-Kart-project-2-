const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');
const app = express();
const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(multer().any())

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Nishant-R:cMVSc6ePV6V4dr03@cluster0.rembes2.mongodb.net/group6Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);


app.listen(  3000, function () {
    console.log('Express app running on port ' + ( 3000))
});