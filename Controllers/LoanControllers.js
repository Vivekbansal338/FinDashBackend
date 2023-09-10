const Loan = require("../Models/LoanModel");
const Borrower = require("../Models/BorrowerModel");

// Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const loan = await Loan.create(req.body);

    //now we will assciate the loan with the borrower
    const borrowerId = req.body.borrower;
    const loanId = loan._id;
    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found." });
    }
    borrower.loans.push(loanId);
    const updatedBorrower = await borrower.save();
    res.status(200).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().select("-paymentHistory");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate({
        path: "borrower",
        select: "-loans -__v -createdAt -updatedAt -paymentHistory",
      })
      .populate("paymentHistory");
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a loan by ID
exports.updateLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a loan by ID
exports.deleteLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json({ message: "Loan deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
