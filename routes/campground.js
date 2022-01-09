const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//Campground Home
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
// Show new Campground Page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
//Create New Campground
router.post(
  "/",
  validateCampground,
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", " successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//show Campground
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate("reviews")
      .populate("author");
    // console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//show campground edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
//update campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", " Successfully Edited a Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Delete One Campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const deletedproduct = await Campground.findByIdAndDelete(id);
    req.flash("success", " Successfully Deleted Campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
