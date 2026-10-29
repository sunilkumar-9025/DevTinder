const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not valid! It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

const validatePassword = async (req) => {
  //check current password
  const user = req.user;
  const isCurrentPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isCurrentPasswordMatch) {
    return false;
  }
  //update new password
  const isPasswordValid = validator.isStrongPassword(req.body.newPassword);
  return isPasswordValid;
};
module.exports = { validateSignUpData, validateEditProfileData, validatePassword };
