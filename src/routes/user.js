const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName age gender about skills";

userRouter.get("/received/request", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", SAFE_USER_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connections,
    });
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

userRouter.get("/connection", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

userRouter.get("/feed", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseint(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * 10;

    const connections = ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const ignoreUser = new Set();
    connections.forEach((r) => {
      ignoreUser.set(r.toUserId.toString());
      ignoreUser.set(r.toUserId.toString());
    });

    const users = await User.find({
      $and: [{ _id: { $nin: Array.from(ignoreUser) } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = userRouter;
