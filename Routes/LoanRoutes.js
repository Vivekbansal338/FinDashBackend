const express = require("express");
const router = express.Router();
const loanController = require("../Controllers/LoanControllers");

// GET /loans
router.get("/", loanController.getLoans);

// GET /loans/:id
router.get("/:id", loanController.getLoanById);

// POST /loans
router.post("/", loanController.createLoan);

// PUT /loans/:id
router.put("/:id", loanController.updateLoanById);

// DELETE /loans/:id
router.delete("/:id", loanController.deleteLoanById);

module.exports = router;
