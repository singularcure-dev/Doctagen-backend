let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let autoIncrement = require("mongoose-auto-increment-fix");

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

UsersSchema.plugin(autoIncrement.plugin, {
  model: "users",
  field: "id",
  startAt: 1,
});
module.exports = mongoose.model("users", UsersSchema);
