const productModel = require("../models/productModel");
const valid = require("../validator/validator");
const jwt = require("jsonwebtoken");
// const moment = require("moment")
const { uploadFile } = require("../controller/awsController");

const createProduct = async (req, res) => {
try {
    let data = req.body;
    let files = req.files

if (!valid.isValidRequestBody(data)) {
    return res.status(400).send({ status: false, message: "please provide data in request body" })
 }

    
} catch (error) {
    res.status(500).send({ status: false, err: error.message });
}
}




module.exports = {createProduct};