const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//Campground Home
router.get("/", catchAsync(campgrounds.index));
// Show new Campground Page
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//Create New Campground
router.post(
  "/",
  validateCampground,
  isLoggedIn,
  catchAsync(campgrounds.createNew)
);
//show Campground
router.get("/:id", catchAsync(campgrounds.showCampground));
//show campground edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.campgroundEdit)
);
//update campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);
//Delete One Campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
