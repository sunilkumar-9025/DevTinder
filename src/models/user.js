const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
       validate:(value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum:{
        values: ['male', 'female'],
        message: `{VALUE} is invalid gender type`
      }
    },
    password: {
      type: String,
      required: true,
      validate:(value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol: " + value);
        }
      }
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder",
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
       validate:(value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL: " + value);
        }
      }
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);


userSchema.methods.validatePassword = async function(password){
  const hashedPasswod = this.password;
  const isPasswordValid = await bcrypt.compare(password, hashedPasswod)
  return isPasswordValid
}


userSchema.methods.getJWT =  function(){
    const token = jwt.sign({ _id: this._id }, "devtinder@123", {
    expiresIn: "7d",
  });

  console.log(token)

  return token
}

const User = new mongoose.model('User', userSchema)
module.exports = User
