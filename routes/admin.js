const express = require("express");
const router = express.Router();
const UsersModel = require("../models/UsersModel");

const adminRequired = require("../libs/adminRequired");
const verifyToken = require("../libs/verifyToken");
const moment = require("moment");
const WordsModel = require("../models/WordsModel");

/*
 * 회원 리스트
 */
router.get("/user/list", verifyToken, adminRequired, async (req, res) => {
  const { page = 1, limit = 10, searchWord, inputMode } = req.query;

  let query = {};

  if (inputMode !== undefined && inputMode !== "") {
    if (inputMode == "username") {
      query.$or = [
        { firstName: { $regex: `.*${searchWord}.*`} }, 
        { lastName: { $regex: `.*${searchWord}.*`} },
      ]
    } else if (inputMode == "email") {
      query.email = {
        $regex: `.*${searchWord}.*`,
      };
    } 
  } else {
    query.$or = [
      { firstName: { $regex: `.*${searchWord}.*`} }, 
      { lastName: { $regex: `.*${searchWord}.*`} },
      { email: { $regex: `.*${searchWord}.*`} },
    ]
  }

  try {
    const count = await UsersModel.find(query).count();
    const data = await UsersModel.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      status: 200,
      data,
      total: count,
      page: page,
    });
  } catch (err) {
    res.json({ status: 500, error: true, message: err.message });
  }
});

/**
 * 전체 회원 검색어 목록
 */
router.get("/user/word", verifyToken, adminRequired, async (req, res) => {
  const { page = 1, limit = 10, userId } = req.query;
  try {
    const count = await WordsModel.find({user: userId}).count();
    const data = await WordsModel.find({user: userId})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
    // data numbering
    data.map((item, i) => {
      item._doc.dataNum = count - (10 * (page - 1)) - i;
    })

    res.json({
      status: 200,
      data,
      total: count,
      page: page,
    });
  } catch (err) {
    res.json({ status: 500, error: true, message: err.message });
  }
});


/**
 * 회원 상세 정보
 * id : 사용자 고유 Object ID
 */

router.get("/user/:id", verifyToken, adminRequired, async (req, res) => {
  try {
    let data = await UsersModel.findOne({ _id: req.params.id }).exec();
    res.json({ status: 200, data });
  } catch (err) {
    res.json({ status: 500, error: true, message: err.message });
  }
});

/**
 * 회원 정보 수정
 */
router.put("/user", verifyToken, adminRequired, async(req, res) => {
  let { userId, isAdmin, firstName, lastName } = req.body;

  let data = {
    isAdmin: isAdmin,
    firstName: firstName,
    // email: email,
    lastName: lastName,
    updatedAt: new Date(),
  };
  UsersModel.updateOne({ _id: userId }, { $set: data }, (err) => {
    if (err) return res.json({ status: 500, error: true, message: err.message });
    res.json({ status: 200, success: true });
  });
});

/**
 * 회원 정보 삭제
 * id : 사용자 고유 Object ID
 */
router.delete("/user/:id", verifyToken, adminRequired, (req, res) => {
  UsersModel.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return res.json({ status: 500, error: true, message: err.message });
    res.json({ status: 200, success: true });
  });
});

/*
 * 회원관리 전체 가입자, 이번달 가입자,오늘가입자, 회원탈퇴 정보
 */
router.get("/dashboard", verifyToken, adminRequired, async (req, res) => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDate();
  let today = moment(new Date(year, month, day)).format();
  let thisMonth = moment(new Date(year, month));
  try {
    let data = await Promise.all([
      UsersModel.find().count(),
      UsersModel.find({ createdAt: { $gte: today } }).count(), 
      UsersModel.find({ createdAt: { $gte: thisMonth } }).count(),
      UsersModel.find({ withdrawAt: { $exists: true } }).count(),
    ]);

    const totalUser = data[0];
    const dayJoinUser = data[1];
    const thisMonthJoinUser = data[2];
    const withdrawUser = data[3];

    res.json({
      status: 200,
      totalUser,
      dayJoinUser,
      thisMonthJoinUser,
      withdrawUser,
    });
  } catch (err) {
    res.json({ status: 500, error: true, message: err.message });
  }
});

router.get("/dashboard/word", verifyToken, adminRequired, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  try {
    let data = await WordsModel.aggregate([
      {
        $group: {
          _id:"$word",
          count: {$count: {}}
        }
      },
      {
        $sort: {count: -1 }
      },
    ])
    .limit(limit * 1);

    res.json({
      status: 200,
      success: true,
      data,
    });
  } catch (err) {
    res.json({ status: 500, error: true, message: err.message });
  }
});

module.exports = router;
