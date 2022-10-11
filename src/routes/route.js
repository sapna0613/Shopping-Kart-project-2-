const express = require('express')
const router = express.Router()
const userController= require("../controller/userController")
const awsController= require("../controller/awsController")
const{authentication,authorisation,authorisationbyBId}=require("../middleware/middle")

const aws= require("aws-sdk")

// ======================================USER API============================================//
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.put("/user/:userId/profile",userController.updateUser)
router.get("/user/:userId/profile",userController.getUser)

router.all("/*", (req, res) => 
{ res.status(400).send({ status: false, message: "Endpoint is not correct" }) })


module.exports = router;