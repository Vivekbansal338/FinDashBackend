const Borrower = require("../Models/BorrowerModel");
const Loan = require("../Models/LoanModel");

// Create a new borrower
exports.createBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.create(req.body);
    res.status(201).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all borrowers
exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate({
      path: "loans",
      select: "amount monthlyPayment status",
    });
    res.json(borrowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single borrower by ID
exports.getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id).populate("loans");
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a borrower by ID
exports.updateBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    Object.assign(borrower, req.body);
    await borrower.save();
    res.json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a borrower by ID
exports.deleteBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    await borrower.remove();
    res.json({ message: "Borrower deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to associate a loan with a borrower
exports.associateLoan = async (req, res) => {
  try {
    const { borrowerId, loanId } = req.params;
    const borrower = await Borrower.findById(borrowerId);

    if (!borrower) {
      return res.status(404).json({ error: "Borrower not found." });
    }
    // Push the loan reference into the borrower's loans array
    borrower.loans.push(loanId);
    // Save the updated borrower
    const updatedBorrower = await borrower.save();
    res.status(200).json(updatedBorrower);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while associating the loan with the borrower.",
    });
  }
};
