const express = require("express");
const router = express.Router();
const Cache = require("memory-cache");
const UsersModel = require("../models/UsersModel");
const sendEmail = require("../libs/sendEmail");
const jwt = require("jsonwebtoken");
const { JWT_SecretKey } = require("../config/env");

// 이메일 발송
router.post("/email", async (req, res) => {
  let { email, findPassword = false } = req.body;
  try {
    const emailCount = await UsersModel.find({ email: email }).countDocuments();
    const user = await UsersModel.findOne({ email: email }).exec();
    if (findPassword == true) {
      if (emailCount < 1) {
        return res.json({
          status: 407,
          success: false,
          message: "가입되어 있지 않은 이메일 입니다.",
        });
      }
      if (user.type != "") {
        return res.json({
          status: 407,
          success: false,
          message: `${user.type} 로 가입되어 있는 이메일주소 입니다. ${user.type} 로 로그인 해주시길 바랍니다.`,
        });
      }
    } else {
      if (emailCount > 0) {
        return res.json({
          status: 407,
          success: false,
          message: "이미 등록된 이메일 입니다.",
        });
      }
    }

    let certCode = [];
    certCode = Math.random().toString(36).substring(2, 11);
    let emailKey = email + "T";
    let count = Cache.get(emailKey);
    if (count > 5) {
      Cache.put(emailKey, count, 3600000); //60 * 60 * 1000 1시간 후 인증 만료됨.
      return res.json({
        status: 407,
        success: true,
        message: "인증번호 횟수가 초과 되었습니다. 1시간 후 다시 진행해주세요.",
      });
    }
    Cache.put(email, certCode, 180000); //3분 후 인증 만료됨.
    Cache.put(emailKey, count + 1, 180000); //3분 후 인증 카운트 만료됨.
    let data = {
      email: email,
      content: certCode,
      firstName: findPassword == true ? user.firstName : "", 
    };
    await sendEmail(data);
    res.json({
      status: 200,
      success: true,
      message: "인증코드 발송",
    });
  } catch (err) {
    console.log("/auth/email-err", err.message);
    return res.json({ status: 500, error: true, message: err.message });
  }
});

// 이메일 검증
router.post("/email/verify", function (req, res) {
  let { email, certCode } = req.body;
  let emailKey = email + "T";
  const result = Cache.get(email);
  if (!result) {
    return res.json({
      status: 409,
      success: false,
      message: "인증번호가 만료되었습니다.인증번호를 다시 요청 해주세요.",
    });
  } else if (result !== certCode) {
    return res.json({
      status: 401,
      success: false,
      message: "인증번호가 잘못 되었습니다.다시 인증번호를 입력해주세요.",
    });
  } else {
    Cache.del(email);
    Cache.del(emailKey);
    res.json({
      status: 200,
      success: true,
      message: "정상적으로 인증이 되었습니다.",
    });
  }
});

router.post("/google/credential", async (req, res) => {
  const { credential } = req.body;
  decoded = jwt.decode(credential);
  if (decoded.email == "" || decoded.email == undefined) {
    return res.json({
      status: 407,
      error: true,
      message: "구글 토큰 이메일이 없는 경우",
    });
  }
  try {
    const user = await UsersModel.findOne({ email: decoded.email });
    if (user) {
      if (user.type != "GOOGLE") {
        return res.json({ status: 409, error: true, data: user.type });
      } else {
        let userInfo = {
          _id: user._id,
          id: user.id,
          email: user.email,
        };
        jsonWebToken = jwt.sign(userInfo, JWT_SecretKey, {
          expiresIn: "30d",
        });
        return res.json({
          status: 200,
          success: true,
          accesstoken: jsonWebToken,
        });
      }
    } else {
      // 신규 유저
      let newUserData = {
        email: decoded.email,
        firstName: decoded.given_name ? decoded.given_name : decoded.name,
        lastName: decoded.family_name,
        password: decoded.email + JWT_SecretKey,
        type: "GOOGLE",
      };
      let newUser = new UsersModel(newUserData);
      await newUser.save();
      let userInfo = {
        _id: newUser._id,
        id: newUser.id,
        email: newUser.email,
      };
      jsonWebToken = jwt.sign(userInfo, JWT_SecretKey, {
        expiresIn: "30d",
      });
      return res.json({
        status: 200,
        success: true,
        newUser: true,
        accesstoken: jsonWebToken,
      });
    }
  } catch (err) {
    return res.json({ status: 500, error: true, message: err.message });
  }
});

module.exports = router;
