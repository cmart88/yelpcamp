const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegistration) //Render registration page
  .post(catchAsync(users.registerUser)); //Register a User

router
  .route("/login")
  .get(users.renderLogin) //render Login page
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  ); //Login User

router.get("/logout", users.logoutUser); //Logout User
module.exports = router;
