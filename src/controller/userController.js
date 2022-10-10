const userModel = require("../models/UserModel");
const valid = require("../validator/validator");
const jwt = require("jsonwebtoken");
// const moment = require("moment")
const { uploadFile } = require("../controller/awsController")
const bcrypt = require('bcrypt');

//===========================================create user=====================================//
const createUser = async (req, res) => {
  try {
    let data = req.body;
    let { fname, lname, email, phone, password, address } = data;
    // console.log(typeof data.email);
    let files = req.files
    // console.log(files[0]);
    if (!valid.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "please provide data in request body" })
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Address Validation+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let requiredField = ["fname", "lname", "email", "phone", "password", "address"]

    for (field of requiredField) {
      if (!data[field]) {
        return res.status(400).send({ status: false, message: `Please provide ${field} field in request body` })
      }
    }

    try {
      data.address = JSON.parse(data.address)
    } catch (error) {
      return res.status(400).send({ status: false, message: "address must be an object" });
    }
    requiredField = ["shipping", "billing"]

    for (field of requiredField) {
      if (!data.address[field]) {
        return res.status(400).send({ status: false, message: `Please provide ${field} key in address Object` })
      }
    }

    requiredField = ["street", "city", "pincode"]
    for (field of requiredField) {
      if (!data.address.shipping[field]) {
        return res.status(400).send({ status: false, message: `Please provide ${field} key in shipping object in address field` })
      } else {
        if (field == "pincode") {
          if (!valid.isValidPincode(data.address.shipping[field])) {
            return res.status(400).send({ status: false, message: `Please provide valid value in ${field} key in shipping object in address field` })
          }
        } else {
          if (!valid.isValid(data.address.shipping[field])) {
            return res.status(400).send({ status: false, message: `Please provide valid value in ${field} key in shipping object in address field` })
          }
        }
      }
      if (!data.address.billing[field]) {
        return res.status(400).send({ status: false, message: `Please provide ${field} key in billing object in address field` })
      } else {
        if (field == "pincode") {
          if (!valid.isValidPincode(data.address.shipping[field])) {
            return res.status(400).send({ status: false, message: `Please provide valid value in ${field} key in billing object in address field` })
          }
        } else {
          if (!valid.isValid(data.address.shipping[field])) {
            return res.status(400).send({ status: false, message: `Please provide valid value in ${field} key in billing object in address field` })
          }
        }
      }
    }


    //---------------------------Validation Fname------------------------------------------//
    if (!valid.isValid(fname)) {
      return res.status(400).send({ status: false, message: " Fname is Not Valid." })
    }
    // console.log(valid.isValidName(fname))
    if (!valid.isValidName(fname)) {

      return res.status(400).send({ status: false, message: " Fname is Not Valid" })
    }
    //---------------------------Validation Lname------------------------------------------//
    if (!valid.isValid(lname)) {
      return res.status(400).send({ status: false, message: " Lname is Not Valid." })
    }
    if (!valid.isValidName(lname)) {
      return res.status(400).send({ status: false, message: " Lname is Not Valid" })
    }
    //---------------------------Validation Email------------------------------------------//
    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, message: "Email is Not Valid." })
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({ status: false, message: " Email is Not Valid" })
    }
    let emailIsUnique=await userModel.findOne({email:email})
    if(emailIsUnique){
      return res.status(400).send({ status: false, message: "Please provide unique email" })
    }
    //---------------------------Phone------------------------------------------------------//
    if (!valid.isValid(phone)) {
      return res.status(400).send({ status: false, message: "Phone is Not Valid." })
    }
    if (!valid.isValidpin(phone)) {
      return res.status(400).send({ status: false, message: "Phone is Not Valid" })
    }
    let phoneIsUnique=await userModel.findOne({phone:phone})
    if(phoneIsUnique){
      return res.status(400).send({ status: false, message: "Please provide unique phone" })
    }
    //----------------------------Password---------------------------------------------------//
    if (!valid.isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "Password is Not Valid" })
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
      data.password=hash;
      // console.log(hash)
    });
    //--------------------------- Profile Image------------------------------------------//
    // console.log(req.body.profileImage)
    if (!files[0]) {
      return res.status(400).send({ status: false, message: "Please provide image File" })
    }
    let fileURL = await uploadFile(files[0])
    data.profileImage = fileURL;

    let savedData=await userModel.create(data);

    return res.status(201).send({ status: true, message: "User Successfully created", data: savedData })

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
