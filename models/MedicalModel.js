let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let MedicalSchema = new Schema({
  index: {
    type: String,
  },
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  gender: {
    type: String,
  },
  img_url: {
    type: String,
  },
  overview: {
    type: String,
  },
  specialty: [],
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  hospitals: [],
  contect: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: "" },
});

module.exports = mongoose.model("medical", MedicalSchema);
