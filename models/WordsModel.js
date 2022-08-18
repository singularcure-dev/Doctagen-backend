let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let autoIncrement = require("mongoose-auto-increment-fix");

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

WordsSchema.plugin(autoIncrement.plugin, {
    model: "words",
    field: "id",
    startAt: 1,
});
module.exports = mongoose.model("words", WordsSchema);
