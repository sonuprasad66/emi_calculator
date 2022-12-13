const express = require("express");
const { userModel } = require("../Models/User.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (name !== "" && email !== "" && password !== "") {
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      res.send({ msg: "User is already exist, please try to login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash_password) => {
        if (err) {
          res.send({ msg: "Something went wrong" });
        } else {
          const new_user = new userModel({
            name: name,
            email: email,
            password: hash_password,
          });
          await new_user.save();
          res.send({ msg: "Signup Successful" });
        }
      });
    }
  } else {
    res.send({ msg: "Please fill all data" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  const hashed_password = user.password;
  const user_id = user._id;

  bcrypt.compare(password, hashed_password, async (err, result) => {
    if (err) {
      res.send({ msg: "Something went is wrong, Please try agin." });
    } else {
      if (result) {
        var token = jwt.sign({ user_id }, process.env.SECRET_KEY);
        res.send({ msg: "Login Successfull", token: token });
      } else {
        res.send({ msg: "Login Faild" });
      }
    }
  });
});

module.exports = {
  userRouter,
};
