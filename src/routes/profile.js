const express = require("express");
const bcrypt = require('bcrypt')
const { validateEditProfileData, validatePassword } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

profileRouter.patch("/edit", async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send("Profile updated successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/password", async (req, res) => {
  try {
    if (!validatePassword(req)) {
      throw new Error("Invalid Password");
    }

    const loggedInUser = req.user;
    const newPassword =  await bcrypt.hash(req.body.newPassword, 10);
    loggedInUser.password = newPassword
    await loggedInUser.save();
    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
