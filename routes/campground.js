const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index)) //Campground Home
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNew)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm); // Show new Campground Page

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) //show Campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  ) //update campground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //Delete One Campground

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.campgroundEdit)
); //show campground edit

module.exports = router;
