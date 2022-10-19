const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel')
const Valid = require("../validator/validator");
const productModel = require('../models/productModel')
const { uploadFile } = require("./awsController");

var nameRegex = /^[a-zA-Z\s]*$/;
var priceRegex = /^[1-9]\d*(\.\d+)?$/;

//########################################## CEREAT ORDER  #######################################//

const createOrder = async function (req, res) {
    try {
        console.log(req.body.cartId)
        if(!req.body.cartId){
            return res.status(400).send({ status: false, message: "please provide cartId in request body " })
        }
        let cart=await cartModel.findById(req.body.cartId).select({_id:0,createdAt:0,updatedAt:0,__v:0}).lean()
        if(cart.userId.toString()!=req.params.userId){
            return res.status(400).send({ status: false, message: "This cartId does not belong to given userId " })
        }
        let isDublicateUser= await orderModel.findOne({userId:req.params.userId})
        if(isDublicateUser){
            return res.status(400).send({ status: false, message: "Order is already created for this user" })
        }
        if(cart.items.length==0){
            return res.status(400).send({ status: false, message: "Cart does not have any items to make orders." })
        }
        let totalQuantity=0
        let cancellable;
        if(req.body.cancellable){
            cancellable=req.body.cancellable
        }else{
            cancellable=true
        }

        for(let ele of cart.items){
            totalQuantity=totalQuantity+ele.quantity;
        }

        let order={...cart,totalQuantity:totalQuantity,cancellable:cancellable,status:"pending",deletedAt:null,isDeleted:false}

        let savedOrder=await orderModel.create(order);
        return res.status(201).send({ status: false, message: "success", data:savedOrder });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



//###################################### UPDATE ORDER #######################################//

const updateOrder = async function (req, res) {
    try {







    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createOrder, updateOrder }