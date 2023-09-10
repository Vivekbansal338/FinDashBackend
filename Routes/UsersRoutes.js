const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UsersControllers");
const authController = require("../Controllers/AuthControllers");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/updateuser", authController.protect, userController.updateuser);

router.delete("/deleteuser", authController.protect, userController.deleteuser);

router.post(
  "/forgotpassword",
  authController.protect,
  userController.forgotpassword
);
router.post(
  "/resetpassword",
  authController.protect,
  userController.resetpassword
);

router.post("/checkusername", userController.checkusername);
router.post("/checkemail", userController.checkemail);
module.exports = router;
