const cartModel = require("../models/cartModel");
const valid = require("../validator/validator");
const productModel = require('../models/productModel')
const { uploadFile } = require("../controller/awsController");
const valid = require("../validator/validator");

var nameRegex = /^[a-zA-Z\s]*$/;
var priceRegex = /^[1-9]\d*(\.\d+)?$/;

//##########################################   #########################################################//

const createCart = async function (req, res) {
    try {
        

        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//###########################################   ##########################################################//

const getCart = async function (req, res) {
    try {
        





    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//#################################################   ######################################################//

const updateCart = async function (req, res) {
    try {

        




    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//###############################################   #################################################//

const deleteCart = async function (req, res) {
    try {

        



    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }