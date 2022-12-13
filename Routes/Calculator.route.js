const express = require("express");
const calculatorRouter = express.Router();
const { userModel } = require("../Models/User.model");
const { calculatorModel } = require("../Models/Calculator.model");
const { authentication } = require("../Middleware/middleware");

calculatorRouter.get("/calculatorHome", authentication, async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  const user = await userModel.findOne({ _id: user_id });
  const { name, email } = user;
  res.send({ name, email });
});

calculatorRouter.post("/calculateEMI", authentication, async (req, res) => {
  const { amount, intrest, months, user_id } = req.body;
  const r = intrest / 12 / 100;
  const EMI = (amount * r * (1 + r) * months) / ((1 + r) * months - 1);

  const total_intrest = (amount / 100) * intrest;
  const total_payment = amount + total_intrest;
  const new_emi = new calculatorModel({
    EMI: EMI,
    interest_payable: r,
    total_payment: total_payment,
    user_id: user_id,
  });
  await new_emi.save();
  res.send({ EMI, interest_payable: r, total_payment: total_payment });
});

module.exports = {
  calculatorRouter,
};
