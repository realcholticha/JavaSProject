const mongoose = require('mongoose')


const roomSchema = new mongoose.Schema({
  date: String,
  Time: Array,
  RoomID: String,
  UserID: String
})


//ส่งออกโมเดล
module.exports = mongoose.model("Room",roomSchema)