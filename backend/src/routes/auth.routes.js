const express = require("express");
const { register, verifyEmail, login } = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);

module.exports = router;