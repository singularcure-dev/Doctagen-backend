const express = require("express");
const router = express.Router();
const UsersModel = require("../models/UsersModel");
const MedicalModel = require("../models/MedicalModel");
const jwt = require("jsonwebtoken");
const { JWT_SecretKey } = require("../config/env");
const verifyToken = require("../libs/verifyToken");
const sha256 = require("js-sha256");

/**
 * 로그인
 * JWT 인증
 * request parameter : email, password
 * response : accesstoken
 */
router.post("/login", async (req, res) => {
  let jsonWebToken;
  const { password, email } = req.body;
  UsersModel.findOne({ email: email }, (err, user) => {
    if (!user) {
      res.json({
        status: 407,
        success: true,
        message: "등록되어 있지 않은 이메일 입니다.",
      });
    } else if (user) {
      UsersModel.findOne(
        { email: email, password: sha256(password) },
        (err, user) => {
          if (err) {
            console.log(err.message);
          }
          if (!user) {
            return res.json({
              status: 409,
              success: true,
              message: "이메일과 비밀번호를 다시 확인해 주세요.",
            });
          } else if (user) {
            let userInfo = {
              _id: user._id,
              email: user.email,
            };

            jsonWebToken = jwt.sign(userInfo, JWT_SecretKey, {
              expiresIn: "30d",
            });

            res.json({ status: 200, success: true, accesstoken: jsonWebToken });
          }
        }
      );
    }
  });
});

/*
 * 회원가입
 * 법률정보 동의, 회원정보, 인증파일 입력
 */
router.post("/join", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  UsersModel.findOne({ email: email }, async (err, user) => {
    if (err) {
      console.log("err", err.message);
      return res.json({ status: 500, error: true, message: "Server error" });
    } else if (user)
      return res.json({
        status: 409,
        error: true,
        message: "이미 회원 가입된 이메일입니다.",
      });

    let userInfo = new UsersModel({
      email: email,
      password: sha256(password),
      firstName: firstName,
      lastName: lastName,
    });

    await userInfo.save();

    // if (userInfo.id == 1 || userInfo == 2) {
    //   UsersModel.updateOne({ id: userInfo.id }, { isAdmin: true }).exec();
    // }

    res.json({
      status: 200,
      success: true,
      message: "회원가입을 진심으로 감사드립니다.",
    });
  });
});

/**
 * 사용자 기본정보 확인
 * response 200 OK, data : 유저 개인정보
 */

router.get("/profile", verifyToken, async (req, res) => {
  try {
    let data = await UsersModel.findOne(
      { _id: req.userId },
      { password: 0 }
    ).exec();
    res.json({ status: 200, success: true, data });
  } catch (err) {
    return res.json({ status: 500, error: true, message: err.message });
  }
});

/**
 * 비밀번호 분실 후 비밀번호 변경
 * request params : email, mobileNo, password
 */
router.put("/pwd", (req, res) => {
  let { email, password } = req.body;

  UsersModel.findOne({ email: email }, async (err, user) => {
    if (err)
      return res.json({ status: 500, error: true, message: "Server error" });

    if (user) {
      let data = {
        password: sha256(password),
      };

      UsersModel.updateOne({ email: email }, { $set: data }, (err) => {
        if (err)
          return res.json({
            status: 500,
            success: false,
            message: err.message,
          });
        res.json({
          status: 200,
          success: true,
          message: "비밀번호 변경이 완료되었습니다.",
        });
      });
    } else {
      res.json({
        status: 409,
        success: false,
        message: "사용자 정보가 정확하지 않습니다.",
      });
    }
  });
});

/**
 * 로그인 이후 비밀번호 변경
 */
router.put("/user/pwd", verifyToken, (req, res) => {
  UsersModel.findOne(
    { _id: req.userId, password: sha256(req.body.password) },
    async (err, user) => {
      if (err)
        return res.json({ status: 500, error: true, message: "Server error" });

      if (user) {
        let data = {
          password: sha256(req.body.newPassword),
        };

        if (err)
          return res.json({
            status: 500,
            success: false,
            message: err.message,
          });

        UsersModel.updateOne({ _id: req.userId }, { $set: data }, (err) => {
          if (err)
            return res.json({ status: 500, success: false, message: err });
          res.json({
            status: 200,
            success: true,
            message: "비밀번호 변경이 완료되었습니다.",
          });
        });
      } else {
        res.json({
          status: 409,
          success: false,
          message: "현재 비밀번호가 일치하지 않습니다.",
        });
      }
    }
  );
});

/**
 * 유저 프로필 업데이트
 *
 */
router.put("/profile", verifyToken, async (req, res) => {
  let { firstName, lastName, userTerms } = req.body;
  try {
    UsersModel.findOne({ _id: req.userId }, (err, user) => {
      if (err)
        return res.json({ status: 500, error: true, message: "Server error" });
      if (user) {
        let data = {
          firstName: firstName != undefined ? firstName : user.firstName,
          lastName: lastName != undefined ? lastName : user.lastName,
          userTerms: userTerms != undefined ? userTerms : user.userTerms,
          updatedAt: new Date(),
        };

        UsersModel.updateOne({ _id: req.userId }, { $set: data }, (err) => {
          if (err)
            return res.json({
              status: 500,
              success: false,
              message: err.message,
            });

          res.json({ status: 200, success: true });
        });
      } else {
        res.json({
          status: 409,
          success: false,
          message: "권한이 없습니다.",
        });
      }
    });
  } catch (err) {
    return res.json({ status: 500, error: true, message: err.message });
  }
});

/*
 * 회원탈퇴
 * 회원정보 삭제
 */
router.put("/withdraw", verifyToken, async (req, res) => {
  try {
    let data = {
      email: "", //  다른 정보로 변경?
      firstName: "탈퇴회원",
      lastName: "",
      withdrawAt: new Date(),
    };
    let withdraw = await UsersModel.updateOne(
      { _id: req.userId },
      { $set: data }
    ).exec();
    res.json({
      status: 200,
      success: true,
    });
  } catch (err) {
    res.json({
      status: 500,
      error: true,
      message: err.message,
    });
  }
});

module.exports = router;
