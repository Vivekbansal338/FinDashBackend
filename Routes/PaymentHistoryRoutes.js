const express = require("express");
const router = express.Router();
const paymentHistoryController = require("../Controllers/PaymentHistoryControllers");

// Get all payment histories
router.get("/", paymentHistoryController.getAllPaymentHistories);

// Get a single payment history
router.get("/:id", paymentHistoryController.getPaymentHistoryById);

// Create a payment history
router.post("/", paymentHistoryController.createPaymentHistory);

// Update a payment history
router.patch("/:id", paymentHistoryController.updatePaymentHistory);

// Delete a payment history
// router.delete("/:id", paymentHistoryController.deletePaymentHistory);

module.exports = router;
