const mongoose = require("mongoose");
const loanSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please enter the loan amount"],
    },

    monthlyPayment: {
      type: Number,
      required: [true, "Please enter the monthly payment amount"],
    },

    startDate: {
      type: Date,
      required: [true, "Please enter the start date"],
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    paymentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentHistory",
      },
    ],

    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrower",
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
