const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

const bankAccountSchema = new mongoose.Schema({
  accountNumber: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema]
});

module.exports = mongoose.model("BankAccount", bankAccountSchema);
