require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/UsersRoutes");
const loanRoutes = require("./Routes/LoanRoutes");
const borrowerRoutes = require("./Routes/BorrowerRoutes");
const paymentHistoryRoutes = require("./Routes/PaymentHistoryRoutes");
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mogoDB connection
mongoose
  .connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/borrowers", borrowerRoutes);
app.use("/api/v1/paymenthistories", paymentHistoryRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
