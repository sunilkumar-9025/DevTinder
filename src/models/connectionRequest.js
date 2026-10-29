const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //refrence to user colection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);


requestSchema.index({toUserId: 1, fromUserId: 1})

requestSchema.pre('save', function(next){
  if(this.fromUserId.equals(this.toUserId)){
    throw new Error({
      message: 'Cannot send connection request to ypuself'
    })
  }
  next()
})


const ConnectionRequest = new mongoose.model('ConnectionRequest', requestSchema)

module.exports = ConnectionRequest