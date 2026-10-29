const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

const {userAuth} = require('./middlewares/auth')

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/',  authRouter)
app.use('/profile', userAuth, profileRouter)
app.use('/request', userAuth,  requestRouter)

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
