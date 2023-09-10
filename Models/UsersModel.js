const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "This email is already registered"],
    trim: true,
    lowercase: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Please enter a valid email"],
  },
  username: {
    type: String,
    required: [true, "Please enter a unique username"],
    unique: [true, "This username is already registered"],
    trim: true,
    lowercase: true,
    minlength: [6, "Username must be atleast 6 characters long"],
    maxlength: [20, "Username must be less than 20 characters long"],
  },
  firstname: {
    type: String,

    minlength: [2, "minimum length is 2 characters"],
    maxlength: [20, "maximum length is 20 characters"],
    trim: true,
  },
  lastname: {
    type: String,

    minlength: [2, "minimum length is 2 characters"],
    maxlength: [20, "maximum length is 20 characters"],
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be atleast 6 characters long"],
    select: false,
  },
  confirmpassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  passwordresetotp: {
    type: Number,
  },
  passwordresetexpires: {
    type: Date,
  },
  passwordupdatedat: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  this.passwordupdatedat = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatejwttoken = function (userid, key, expiresin) {
  const token = jwt.sign({ id: userid }, key, {
    expiresIn: expiresin,
  });
  return token;
};

userSchema.methods.generateotp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
