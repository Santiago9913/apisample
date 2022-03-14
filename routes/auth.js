const express = require("express");
const user = require("../controllers/user");

const router = express.Router();

router.get("/token", user.requestToken);

module.exports = router;
