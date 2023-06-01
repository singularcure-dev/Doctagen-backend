const express = require("express");
const router = express.Router();

/**
 * git pull test
 */

/**
 * Ping test
 */

router.get("/", (req, res) => {
  res.json({ status: 200, success: true });
});

module.exports = router;
