const express = require("express");
const router = express.Router();

/**
 * Ping test
 */

router.get("/", (req, res) => {
    res.json({ status: 200, success: true });
});

module.exports = router;
