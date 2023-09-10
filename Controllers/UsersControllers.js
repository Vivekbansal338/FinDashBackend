const User = require("../Models/UsersModel");
const sendresponse = require("../Helper/ErrorFunctions");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vivekb379@gmail.com",
        pass: "tauidgmzdikralnw",
      },
    });
    const mailOptions = {
      from: "vivekb379@gmail.com",
      to: email,
      subject: subject,
      text: text,
    };
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

exports.signup = async (req, res) => {
  const tempdata = { ...req.body };
  const requireddata = {
    email: tempdata.email,
    password: tempdata.password,
    username: tempdata.username,
    confirmpassword: tempdata.confirmpassword,
  };
  try {
    const user = await User.create(requireddata);
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });
    return res.status(201).json({
      status: 201,
      message: "success",
    });
  } catch (err) {
    return sendresponse(res, 500, "fail", err);
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return sendresponse(
        res,
        400,
        "fail",
        "Please provide email and password"
      );
    }
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      sendresponse(res, 404, "fail", "User not found");
      return;
    }
    const comparepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (comparepassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // const userdata = {
      //   email: user.email,
      //   username: user.username,
      // };

      return res.status(201).json({
        status: 200,
        message: "success",
        token: token,
      });
    } else {
      return sendresponse(res, 401, "fail", "Invalid Credentials");
    }
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.forgotpassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return sendresponse(res, 400, "fail", "Please provide email");
    }
    const user = await User.findOne({ email: req.body.email });
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to user email
    const emailSent = await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It expires in 5 minutes.`
    );

    if (!emailSent) {
      return sendresponse(
        res,
        500,
        "fail",
        "Failed to send OTP. Please try again later."
      );
    }

    // Save the OTP in the database
    user.passwordresetotp = otp;
    user.passwordresetexpires = Date.now() + 1000 * 60 * 5;
    await user.save({ validateBeforeSave: false });
    return sendresponse(res, 200, "success", "OTP sent to your email.");
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { email, otp, newpassword, newconfirmpassword } = req.body;

    if (!email || !otp || !newpassword || !newconfirmpassword) {
      return sendresponse(
        res,
        400,
        "fail",
        "Please provide all the required fields."
      );
    }

    const user = await User.findOne({ email: email });

    if (user.passwordresetotp !== +otp) {
      return sendresponse(res, 400, "fail", "Invalid OTP");
    }

    if (user.passwordresetexpires < Date.now()) {
      return sendresponse(res, 400, "fail", "OTP expired");
    }

    if (newpassword !== newconfirmpassword) {
      return sendresponse(res, 400, "fail", "Passwords do not match");
    }

    user.password = newpassword;
    user.confirmpassword = newconfirmpassword;
    user.passwordresetotp = undefined;
    user.passwordresetexpires = undefined;
    // user.passwordupdatedat = Date.now();
    await user.save();
    return sendresponse(res, 200, "success", "Password reset successful");
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.updateuser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    user.username = req.body.newusername ?? user.username;
    const newuser = await user.save({ validateBeforeSave: false });
    const userdata = {
      email: newuser.email,
      username: newuser.username,
    };
    return sendresponse(res, 200, "success", userdata);
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.deleteuser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    user.active = false;
    await user.save({ validateBeforeSave: false });
    return sendresponse(res, 200, "success", "User deleted successfully");
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.checkusername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return sendresponse(res, 200, "success", "Username already exists");
    } else {
      return sendresponse(res, 200, "success", "Username available");
    }
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};

exports.checkemail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return sendresponse(res, 200, "success", "Email already exists");
    } else {
      return sendresponse(res, 200, "success", "Email available");
    }
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};
