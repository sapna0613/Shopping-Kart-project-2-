const express = require('express')
const router = express.Router()
const userController= require("../controller/userController")
const productController= require("../controller/productController")
const awsController= require("../controller/awsController")

const{authentication,authorisation,authorisationbyBId}=require("../middleware/middle")

const aws= require("aws-sdk")

// ======================================USER API============================================//
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.put("/user/:userId/profile",authentication,authorisationbyBId,userController.updateUser)
router.get("/user/:userId/profile",authentication,userController.getUser)

// ======================================PRODUCT API============================================//
router.post("/products",productController.createProduct)
router.get("/products",productController.getProduct)
// router.put("/productsSize/:productId/size",productController.updateSize)
router.put("/products/:productId",productController.updateProductById)

router.get("/products/:productId",productController.getProductById)
router.delete("/products/:productId",productController.deleteProduct)


router.all("/*", (req, res) => 
{ console.log(req.params.productId)
    res.status(400).send({ status: false, message: "Endpoint is not correct" }) })


module.exports = router;
