const { PaymentHistory } = require("../Models/PaymentHistoryModel");
const Loan = require("../Models/LoanModel");
const Borrower = require("../Models/BorrowerModel");

// Get all payment histories
const getAllPaymentHistories = async (req, res) => {
  try {
    const paymentHistories = await PaymentHistory.find();
    res.json(paymentHistories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single payment history by ID
const getPaymentHistoryById = async (req, res) => {
  try {
    const paymentHistory = await PaymentHistory.findById(req.params.id);

    if (paymentHistory == null) {
      return res.status(404).json({ message: "Payment history not found" });
    }

    res.json(paymentHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPaymentHistory = async (req, res) => {
  const paymentHistory = new PaymentHistory({
    duedate: req.body.duedate,
    paiddate: req.body.paiddate,
    amounttopay: req.body.amounttopay,
    amountpaid: req.body.amountpaid,
    amountforgiven: req.body.amountforgiven,
    status: req.body.status,
    loan: req.body.loan,
    borrower: req.body.borrower,
  });

  try {
    const newPaymentHistory = await paymentHistory.save();

    // Update loan with payment history ID
    const loan = await Loan.findById(req.body.loan);
    loan.paymentHistory.push(newPaymentHistory._id);
    await loan.save();

    // Update borrower with payment history ID
    const borrower = await Borrower.findById(req.body.borrower);
    borrower.paymentHistory.push(newPaymentHistory._id);
    await borrower.save();

    res.status(201).json(newPaymentHistory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a payment history
const updatePaymentHistory = async (req, res) => {
  try {
    const paymentHistory = await PaymentHistory.findById(req.params.id);

    if (paymentHistory == null) {
      return res.status(404).json({ message: "Payment history not found" });
    }

    if (req.body.duedate != null) {
      paymentHistory.duedate = req.body.duedate;
    }

    if (req.body.paiddate != null) {
      paymentHistory.paiddate = req.body.paiddate;
    }

    if (req.body.amounttopay != null) {
      paymentHistory.amounttopay = req.body.amounttopay;
    }

    if (req.body.amountpaid != null) {
      paymentHistory.amountpaid = req.body.amountpaid;
    }

    if (req.body.amountforgiven != null) {
      paymentHistory.amountforgiven = req.body.amountforgiven;
    }

    if (req.body.status != null) {
      paymentHistory.status = req.body.status;
    }

    const updatedPaymentHistory = await paymentHistory.save();
    res.json(updatedPaymentHistory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a payment history
// const deletePaymentHistory = async (req, res) => {
//   try {
//     const paymentHistory = await PaymentHistory.findById(req.params.id);

//     if (paymentHistory == null) {
//       return res.status(404).json({ message: "Payment history not found" });
//     }

//     await paymentHistory.remove();
//     res.json({ message: "Payment history deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

module.exports = {
  getAllPaymentHistories,
  getPaymentHistoryById,
  createPaymentHistory,
  updatePaymentHistory,
  // deletePaymentHistory,
};
