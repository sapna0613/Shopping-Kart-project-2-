const userModel = require("../models/UserModel");
const valid = require("../validator/validator");
const jwt = require("jsonwebtoken");
const moment = require("moment")

//===========================================create user=====================================//
const createUser = async (req, res) => {
  try {
  
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
