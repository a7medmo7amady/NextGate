const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, verifyEmail, login } = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:3000/login?error=google_failed" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);

module.exports = router;
