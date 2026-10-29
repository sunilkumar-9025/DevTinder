const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://sunilkumar9025_db_user:4B67oVRO2x1M0Ckm@merncluster.s2a4ikp.mongodb.net/devTinder')
}

module.exports = connectDB