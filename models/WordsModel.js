let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let WordsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  type: {
    type: String,
  },
  word: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("words", WordsSchema);
