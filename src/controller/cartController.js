const cartModel = require("../models/cartModel");
const Valid = require("../validator/validator");
const productModel = require('../models/productModel')
const { uploadFile } = require("../controller/awsController");



//########################################## CREATE CART API #########################################################//

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
        return res.status(400).send({ status: false, message: "Product id is not Valid" })
    };

    if (quantity || quantity == "") {
        if (!Valid.isValidNum(quantity)) {
            return res.status(400).send({ status: false, message: "Quantity is not Valid" })
        }
    }
    if (!quantity) { quantity = 1 }

    if (cartId) {
        if (!Valid.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Cart id is not Valid" })
        };
    }


    const findCart = await cartModel.findOne({ userId: userId });
    const product = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!product) {
        return res.status(404).send({ status: false, message: " productId not found!" })
    }

//************** Cart is Available ********************************/

if (findCart) {
    console.log(findCart)
    if (!cartId) {
        return res.status(400).send({ status: false, message: "Please provide cart id to add items in the crat" })
    }
    if (findCart._id.toString() !== cartId) {
        return res.status(400).send({ status: false, message: "Cart id is not Match" })
    }

//--------------------- Prodect is alredy in cart -------------------------------------//

    let isProductAlready = 0;
    let newQuantity = 0
    for (let i = 0; i < findCart.items.length; i++) {

    if (findCart.items[i].productId.toString() == productId) {
        isProductAlready++
        newQuantity = (findCart.items[i].quantity) + quantity
        console.log("done 1");
    }
}



if(isProductAlready > 0){
    const updateProduct = await cartModel.findOneAndUpdate(
        { userId: userId ,"items.productId":productId},
        {   $set: { "items.$.quantity": newQuantity } ,
            $inc: { totalPrice: (product.price)*quantity  }},
        { new: true }
    ).populate([{ path: "items.productId" }]);
return res.status(201).send({status: true, message: "Success update Product Quantity", data: updateProduct });

} else {
    const addProduct = await cartModel.findOneAndUpdate(
        { userId: userId },
        {
            $push: { items: [{ productId: productId, quantity: quantity }] },
            $inc: { totalPrice: (product.price) * quantity, totalItems: 1 },
        }, { new: true }).populate([{ path: "items.productId" }]);

    return res.status(201).send({ status: true, message: "Success Add New Product", data: addProduct })
}
} else {
    if (cartId) {
        return res.status(400).send({ status: false, message: "NO cart is created from this userID" })
    }
}

    let obj = {
        userId: userId,
        items: [{ productId: productId, quantity: quantity }],
        totalPrice: (product.price) * quantity,
        totalItems: 1
    }
    await cartModel.create(obj)
    const createNewCart = await cartModel.findOne({ userId: userId })/*.populate([{ path: "items.productId" }])*/
    return res.status(201).send({ status: true, message: "Success Creat New Cart", data: createNewCart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//########################################### Get Cart  ##########################################################//

const getCart = async function (req, res) {
    try {
        let data = req.query
        let condition = { isDeleted: false }

        let { userId } = data
        if (userId) {
            if (!validId(userId)) return res.status(400).send({ status: false, message: "Please provide valid userId" })
            condition.userId = userId
        }
        let cart = await cartModel.cart()
        if (!cart) {
            return res.status(400).json({ type: "Invalid", msg: "Cart not Found", })
        }
        res.status(200).json({ status: true, data: cart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




//#################################################   ######################################################//

const updateCart = async function (req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "Request body is empty" });
        }
        let arr = ["productId", "cartId", "removeProduct"]

        for (ele of arr) {
            
            if (ele == "removeProduct") {
                if(req.body[ele]==undefined||req.body[ele]==="") return res.status(400).send({ status: false, message: `Please provide ${ele} field in request body.` });
                req.body[ele] = Number(req.body[ele])
                if (![1, 0].includes(req.body[ele])) return res.status(400).send({ status: false, message: "removeProduct can be 1 and 0 only." });
            } else {
                if (!req.body[ele]) {
                    return res.status(400).send({ status: false, message: `Please provide ${ele} field in request body` });
                }
                if (!Valid.isValidObjectId(req.body[ele])) return res.status(400).send({ status: false, message: `${ele} is not Valid objectId` });
            }
        }

        let cart = await cartModel.findById(req.body.cartId)
        if (!cart) {
            return res.status(400).send({ status: false, message: ` This (${req.body.cartId}) cartId does not exists.` })
        } else {
            if (cart.userId.toString() != req.params.userId) {
                return res.status(400).send({ status: false, message: ` This (${req.params.cartId}) cartId is not of this user.` })
            }
            if (cart.items.length == 0) {
                return res.status(400).send({ status: false, message: `cart does not have any products.` })
            }
        }

        let isProductAlready;

        for (let i = 0; i < cart.items.length; i++) {
            // if(PId=="undefined"){PId==0}else{PId.toString()}
            // console.log(findCart.items[i].productId);
            if (cart.items[i].productId.toString() == req.body.productId) {
                isProductAlready = i
            }
        }
 
        console.log(cart)
        if (isProductAlready == undefined) {
            return res.status(400).send({ status: false, message: `This product is not in cart` })
        }

        let product = await productModel.findOne({_id:req.body.productId,isDeleted:false})
        if(!product){
            return res.status(400).send({ status: false, message: `Product does not exist or it may deleted` })
        }
        console.log(cart)
        let updateProduct;

        if (req.body.removeProduct == 1) {
            if (cart.items[isProductAlready].quantity == 1) {
                updateProduct = await cartModel.findOneAndUpdate(
                    { _id: req.body.cartId },
                    {
                        $pull: { items: { productId: req.body.productId } },
                        $inc: { totalPrice: -product.price, totalItems: -1 }
                    },
                    { new: true }
                )
            } else {
                updateProduct = await cartModel.findOneAndUpdate(
                    { _id: req.body.cartId, "items.productId": req.body.productId },
                    {
                        $set: { "items.$.quantity": cart.items[isProductAlready].quantity - 1 },
                        $inc: { totalPrice: -product.price }
                    },
                    { new: true }
                )
            }
        } else {
            updateProduct = await cartModel.findOneAndUpdate(
                { _id: req.body.cartId },
                {
                    $pull: { items: { productId: req.body.productId } },
                    $inc: { totalPrice: -((product.price) * cart.items[isProductAlready].quantity), totalItems: -1 }
                },
                { new: true }
            )
        }

        return res.status(400).send({ status: true, message: updateProduct })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//###############################################   #################################################//

const deleteCart = async function (req, res) {
    try {
        const userId = req.params.userId
//--------------------- DELETE CART -----------------------------------//

    const cart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalItems: 0, totalPrice: 0 }, { new: true })

    if (!cart) {
        return res.status(404).send({ status: false, message: "Cart not exist for this userId" })
    }
        return res.status(200).send({ status: true, message: "deleted successfully", data: cart })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }