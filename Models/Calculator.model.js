const mongoose = require("mongoose");

const calculatorSchema = mongoose.Schema(
  {
    amount: { type: Number, require: true },
    intrest: { type: Number, require: true },
    months: { type: Number, require: true },
    user_id: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const calculatorModel = mongoose.model("emi", calculatorSchema);

module.exports = {
  calculatorModel,
};
