const userModel = require("../models/UserModel");
const valid = require("../validator/validator");
const jwt = require("jsonwebtoken");
// const moment = require("moment")
const {uploadFile}=require("../controller/awsController")

//===========================================create user=====================================//
const createUser = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    let {fname, lname, email,phone,password,address} = data;
    let files= req.files
    if (!valid.isValidRequestBody(data)){
      return res.status(400).send({ status: false, message: "please provide data in request body" })}
 
      let requiredField=["fname", "lname"," email","phone","password","address"]

  for(field of requiredField){
    if(!data.hasOwnProperty(field)){
      return res.status(400).send({ status: false, message: `This ${field} is Not Present in request body` })
    }
  }
//---------------------------Validation Fname------------------------------------------//

if(!valid.isValidName(fname)){
  return res.status(400).send({ status: false, message: " Fname is Not Valid" })
}
//---------------------------Validation Lname------------------------------------------//

if(!valid.isValidName(lname)){
  return res.status(400).send({ status: false, message: " Lname is Not Valid" })
}

//---------------------------Validation Email------------------------------------------//

if(!valid.isValidEmail(email)){
  return res.status(400).send({ status: false, message: " Email is Not Valid" })
}

//--------------------------- Profile Image------------------------------------------//
// if(files[0]>0){

// }


//---------------------------Validation Profile Image------------------------------------------//


  } catch (error) {
    res.status(500).send({ status: false, err: error.message });
  }
};

//=======================================login/token generation===============================//

const loginUser = async function (req, res) {
  try {
 
  } catch (error) {
    res.status(500).send({ status: false, err: error.message });
  }
};
module.exports = { createUser, loginUser };
