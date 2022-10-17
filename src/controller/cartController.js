const cartModel = require("../models/cartModel");
const Valid = require("../validator/validator");
const productModel = require('../models/productModel')
const { uploadFile } = require("../controller/awsController");



//##########################################   #########################################################//

const createCart = async function (req, res) {
    try {
        const data = req.body
        const userId = req.params.userId
        let { productId, quantity, cartId } = data

//==================================  Validation Data ===============================================//

    if (Object.keys(data).length === 0) {
        return res.status(400).send({ status: false, message: "Request body is empty" });
    }

    if (!Valid.isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "Product id is not Valid" })};

    if(quantity || quantity==""){
        if(!Valid.isValidNum(quantity)){
            return res.status(400).send({ status: false, message: "Quantity is not Valid" })
        }}
    if(! quantity ){quantity=1}

    if(cartId){
        if (!Valid.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Cart id is not Valid" })};
    }


    const findCart = await cartModel.findOne({userId:userId});
    const product = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!product) {
        return res.status(404).send({ status: false, message: " productId not found!" })
    }

//************** Cart is Avlabal ********************************/

if (findCart) {
    console.log(findCart)
    if(!cartId){
        return res.status(400).send({ status: false, message: "Please provide cart id to add items in the crat" })
    }
    if(findCart._id.toString() !==cartId){
        return res.status(400).send({ status: false, message: "Cart id is not Match" })
    }
    
//--------------------- Prodect is alredy in cart -------------------------------------//

let isProductAlready=0;
let newQuantity=0
for (let i = 0; i < findCart.items.length; i++) {
    // if(PId=="undefined"){PId==0}else{PId.toString()}
    // console.log(findCart.items[i].productId);

    if (findCart.items[i].productId.toString() == productId){
        isProductAlready++
         newQuantity=(findCart.items[i].quantity)+quantity
         console.log("done 1");
    }}



if(isProductAlready > 0){
    const updateProduct = await cartModel.findOneAndUpdate(
        { userId: userId },
        {   $set: { items: [{ productId:productId , quantity: newQuantity }] },
            $inc: { totalPrice: (product.price)*quantity  }},
        { new: true }
    )/*.populate([{ path: "items.productId" }]);*/
    return res.status(201).send({status: true, message: "Success update Product Quantity", data: updateProduct });

}else{
    const addProduct=await cartModel.findOneAndUpdate(
        { userId: userId },
        { $push: { items: [{ productId: productId, quantity: quantity }] },
         $inc: {totalPrice:( product.price)*quantity, totalItems:1 },
        }, { new: true })/*.populate([{ path: "items.productId" }]);*/

    return res.status(201).send({status: true, message: "Success Add New Product", data: addProduct })
}
}else{
    if(cartId){
        return res.status(400).send({ status: false, message: "NO cart is created from this userID" })
    }
}

    let obj={
        userId:userId,
        items:[{productId:productId ,quantity:quantity}],
        totalPrice:(product.price)*quantity,
        totalItems:1
    }
    await cartModel.create(obj)
    const createNewCart=await cartModel.findOne({userId:userId})/*.populate([{ path: "items.productId" }])*/
    return res.status(201).send({status: true, message: "Success Creat New Cart", data: createNewCart })



    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//########################################### Get Cart  ##########################################################//

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