const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    driverName: String,
  password: String,
  mobileNumber: Number,
  carModel: String,
  rcBookNumber: {
    type: String,
    unique: true
  },
  token: String,
  isActive: {
    type: String,
    default: "active"
  },
  location: {  // Change this from an array to an object
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    }
  }
})

const Driver =  mongoose.model("Driver", driverSchema);
module.exports = Driver
