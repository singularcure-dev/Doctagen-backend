let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UsersSchema = new Schema({
  email: {
    type: String,
  },
  type: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userTerms: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: "" },
  withdrawAt: { type: Date },
});

module.exports = mongoose.model("users", UsersSchema);
