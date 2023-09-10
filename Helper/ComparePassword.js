const bcrypt = require("bcrypt");

async function comparePassword(loginPassword, userpassword) {
  return await bcrypt.compare(loginPassword, userpassword);
}

module.exports = comparePassword;
