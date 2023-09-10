const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
    },

    phoneno: {
      type: Number,
      required: [true, "Please enter your phone number"],
      unique: true,
    },

    address: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    loans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
      },
    ],
    paymentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentHistory",
      },
    ],
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);

module.exports = Borrower;
