/** 환경 설정 기본 값 */

const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

//MongoDB 접속
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const autoIncrement = require("mongoose-auto-increment-fix");


const db = mongoose.connection;
db.on("error", console.error);
db.once("open", function (data) {
  console.log("mongodb connect");
});

const connect = mongoose.connect(
  "mongodb://admin:1234@ac-bpisf4e-shard-00-00.zavbrkk.mongodb.net:27017,ac-bpisf4e-shard-00-01.zavbrkk.mongodb.net:27017,ac-bpisf4e-shard-00-02.zavbrkk.mongodb.net:27017/doctagen_01?ssl=true&replicaSet=atlas-8z9h8k-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useMongoClient: true }
);
autoIncrement.initialize(connect);


const admin = require("./routes/admin");
const accounts = require("./routes/accounts");
const routes = require("./routes/index");
const auth = require("./routes/auth");
const medical = require("./routes/medical");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;

// 미들웨어 셋팅
app.use(logger("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(helmet());

// Routing
app.use("/admin", admin);
app.use("/accounts", accounts);
app.use("/auth", auth);
app.use("/medical", medical);
app.use("/", routes); //  render

app.listen(port, function () {
  console.log("Express listening on port", port);
});

module.exports = app;
