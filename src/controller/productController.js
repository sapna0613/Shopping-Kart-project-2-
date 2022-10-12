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

const getProduct = async (req, res) => {
    try {
        let filter = { isDeleted: false }
        if (req.query.size) {
            if (valid.isValid(req.query.size) && valid.isValidSize(req.query.size)) {
                filter.availableSizes = req.query.size
            } else {
                return res.status(400).send({ status: false, message: "please provide valid size" })
            }
        }

        if (req.query.name) {
            if (valid.isValid(req.query.name) && /^[a-zA-Z ]$/.test(req.query.name)) {
                filter.title = { $regex: req.query.name, $options: "$i" }
            } else {
                return res.status(400).send({ status: false, message: "please provide valid name" })
            }
        }

        if (req.query.priceGreaterThan) {
            if (valid.isValidPrice(req.query.priceGreaterThan)) {
                req.query.priceGreaterThan = Number(req.query.priceGreaterThan)
                filter.price = { "$gt": req.query.priceGreaterThan }
            } else {
                return res.status(400).send({ status: false, message: "please provide valid Price" })
            }
        }

        if (req.query.priceLessThan) {
            if (valid.isValidPrice(req.query.priceLessThan)) {
                req.query.priceLessThan = Number(req.query.priceLessThan)
                if (filter.price) {
                    filter.price.$lt = req.query.priceLessThan
                } else {
                    filter.price = { "$lt": req.query.priceLessThan }
                }
            } else {
                return res.status(400).send({ status: false, message: "please provide valid Price" })
            }
        }


        let savedData;

        if (req.query.priceSort) {
            req.query.priceSort = req.query.priceSort.trim()
            if (["-1", "1"].indexOf(req.query.priceSort) < 0) {
                return res.status(400).send({ status: false, message: "please provide valid value in priceSort" })
            }
            if (req.query.priceSort == "1") {
                console.log(filter,1)
                savedData = await productModel.find(filter).sort({ price: 1 })
            } else if (req.query.priceSort == "-1") {
                console.log(filter,2);
                savedData = await productModel.find(filter).sort({ price: -1 })
            }
        } else {
            console.log(filter,3);
            savedData = await productModel.find(filter)
        }

        if (savedData.length == 0) {
            return res.status(400).send({ status: false, message: "No data found" })
        }
        return res.status(200).send({ status: true, data: savedData })
    }
    catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }







}




module.exports = { createProduct, getProduct };