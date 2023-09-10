const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  duedate: {
    type: Date,
    required: [true, "Please enter the due date"],
  },

  paiddate: {
    type: Date,
    default: Date.now,
  },

  amounttopay: {
    type: Number,
    required: [true, "Please enter the amount"],
  },

  amountpaid: {
    type: Number,
    required: [true, "Please enter the amount paid"],
  },

  amountforgiven: {
    type: Number,
    required: [true, "Please enter the amount forgiven"],
    default: 0,
  },

  status: {
    type: String,
    enum: ["paid", "unpaid", "half-paid", "pending"],
    default: "unpaid",
  },
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower",
    required: true,
  },
});

const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);

module.exports = { PaymentHistory };
