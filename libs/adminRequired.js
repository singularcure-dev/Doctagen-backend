const UsersModel = require("../models/UsersModel");

module.exports = async function (req, res, next) {
  const user = await UsersModel.findOne({ _id: req.userId }).exec();
  if (user.isAdmin == true) {
    next();
  } else {
    return res.status(409).json({ message: "접급권한이 없습니다." });
  }
};
