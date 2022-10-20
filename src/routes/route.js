const express = require('express')
const router = express.Router()
const userController= require("../controller/userController")
const cartController=require("../controller/cartController")
const productController= require("../controller/productController")
const orderController= require("../controller/orderController")


const{authentication,authorisationbyBId}=require("../middleware/middle")



// ======================================USER APIs============================================//
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.put("/user/:userId/profile",authentication,authorisationbyBId,userController.updateUser)
router.get("/user/:userId/profile",authentication,userController.getUser)

// ======================================PRODUCT APIs ============================================//
router.post("/products",productController.createProduct)
router.get("/products",productController.getProduct)
router.put("/products/:productId",productController.updateProductById)

router.get("/products/:productId",productController.getProductById)
router.delete("/products/:productId",productController.deleteProduct)

//=================================== CART APIs  ================================================//
router.post("/users/:userId/cart",authentication,authorisationbyBId,cartController.createCart)
router.get("/users/:userId/cart",authentication,authorisationbyBId,cartController.getCart)
router.put("/users/:userId/cart",authentication,authorisationbyBId,cartController.updateCart)
router.delete("/users/:userId/cart",authentication,authorisationbyBId,cartController.deleteCart)

//=================================== ORDER APIs  ================================================//
router.post("/users/:userId/orders",authentication,authorisationbyBId,orderController.createOrder)

router.put("/users/:userId/orders",authentication,authorisationbyBId,orderController.updateOrder)



router.all("/*", (req, res) => 
{ console.log(req.params.productId)
    res.status(400).send({ status: false, message: "Endpoint is not correct" }) })


module.exports = router;
