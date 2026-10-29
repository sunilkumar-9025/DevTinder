var jwt = require('jsonwebtoken');
const User = require("../models/user")
const secretKey = 'devtinder@123'


const userAuth = async (req, res, next) => {
try{ 
  const { token } = req.cookies;

  if(!token){
    throw new Error('Invaid Token')
  }

  const decodedObj = jwt.verify(token, secretKey)

  const{ _id } = decodedObj;

  const user = await User.findById(_id)

  if(!user){
    throw new Error('User not found')
  }

  console.log(user)
  req.user = user

  next()
}catch(err){
    res.status(400).send('Error:' + err.message)
}

};
module.exports = { userAuth };
