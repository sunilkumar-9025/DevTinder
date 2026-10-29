const express = require("express");
const connectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const requestRouter = express.Router();


requestRouter.post("/send/:status/:toUserId", async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      throw new Error({ message: "Invalid status type" });
    }

    const toUser = await user.findById(toUserId);
    if (!toUser) {
      throw new Error({
        message: "User doesnot exist",
      });
    }

    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error({
        message: "Connection request already exist",
      });
    }

    const newConnectionRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();

    res.json({ message: "Connection request sent/ignore successfully", data });
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

module.exports = requestRouter;
