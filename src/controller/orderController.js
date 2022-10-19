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
        if (!req.body.cartId) {
            return res.status(400).send({ status: false, message: "please provide cartId in request body " })
        }
        if(!Valid.isValidObjectId(req.body.cartId)){
            return res.status(400).send({ status: false, message: "please provide valid cartId in request body " })
        }
        let cancellable;
        if (req.body.hasOwnProperty("cancellable")) {
            if(typeof req.body.cancellable!="boolean"){
            return res.status(400).send({ status: false, message: "Cancellable must be in boolean." })
            }
            cancellable = req.body.cancellable
        } else {
            cancellable = true
        }
        let cart = await cartModel.findById(req.body.cartId).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }).lean()
        
        if(!cart){
            return res.status(400).send({ status: false, message: "NO cart exist from this cartId" });
        }

        if (cart.userId.toString() != req.params.userId) {
            return res.status(400).send({ status: false, message: "This cartId does not belong to given userId " })
        }

        let isDublicateUser = await orderModel.findOne({ userId: req.params.userId })
        if (isDublicateUser) {
            return res.status(400).send({ status: false, message: "Order is already created for this user" })
        }

        if (cart.items.length == 0) {
            return res.status(400).send({ status: false, message: "Cart does not have any products to make orders." })
        }

        let totalQuantity = 0
        for (let ele of cart.items) {
            totalQuantity = totalQuantity + ele.quantity;
        }

        let order = { ...cart, totalQuantity: totalQuantity, cancellable: cancellable, status: "pending", deletedAt: null, isDeleted: false }


        let savedOrder = await orderModel.create(order);
        await cartModel.findByIdAndUpdate( req.body.cartId , { items: [], totalItems: 0, totalPrice: 0 })

        return res.status(201).send({ status: true, message: "success", data: savedOrder });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



//###################################### UPDATE ORDER #######################################//

const updateOrder = async function (req, res) {
    try {
        const userId = req.params.userId
        const { orderId, status } = req.body

//----------------------------- Validating body -----------------------------//
    if (!isValidBody(req.body)) {
        return res.status(400).send({ status: false, message: 'provide appropriate orderId in request body' })
    }


    const findOrder = await OrderModel.findOne({ _id: orderId, userId: userId })
    if (!findOrder)
    return res.status(404).send({ status: false, message: `Order details is not found with the given OrderId: ${userId}` })


    if (findOrder.cancellable == false) {

        if (!isValid(status))
    return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only" });

    let statusIndex = ["pending", "completed", "cancelled"];
    
    if (statusIndex.indexOf(status) == -1)
        return res.status(400).send({ status: false, message: "Please provide status from these options only ('pending', 'completed' or 'cancelled')" });

    if (status == 'completed') {

        if (findOrder.status == 'pending') {
            const updateStatus = await OrderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
            return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
        }
        if (findOrder.status == 'completed') {
            return res.status(400).send({ status: false, message: "The status is already completed" });
        }
        if (findOrder.status == 'cancelled') {
            return res.status(400).send({ status: false, message: "The status is cancelled, you cannot change the status" });
        }
    }

    if (status == 'cancelled') {
        return res.status(400).send({ status: false, message: "Cannot be cancelled as it is not cancellable" })
    }
}

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createOrder, updateOrder }