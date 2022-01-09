const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

//Render registration page
router.get("/register", users.renderRegistration);

//Register a User
router.post("/register", catchAsync(users.registerUser));

//render Login page
router.get("/login", users.renderLogin);

//Login User
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

//Logout User
router.get("/logout", users.logoutUser);
module.exports = router;
