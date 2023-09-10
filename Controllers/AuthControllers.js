const sendresponse = require("../Helper/ErrorFunctions");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("../Models/UsersModel");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return sendresponse(res, 401, "fail", "You are not logged in");
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRETKEY
    );

    const user = await User.findById({ _id: decoded.id });
    if (!user) {
      return sendresponse(
        res,
        401,
        "fail",
        "The user belonging to this token does no longer exist"
      );
    }
    const dateObject = new Date(user.passwordupdatedat);
    const passwordchangetimestamp = Math.floor(dateObject.getTime() / 1000); // Divide by 1000 to get seconds

    if (decoded.iat < passwordchangetimestamp) {
      return sendresponse(res, 401, "fail", "Password changed Login again");
    }

    next();
  } catch (err) {
    return sendresponse(res, 500, "fail", err.message);
  }
};
