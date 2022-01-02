const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
	else {
		next();
	}
};
//Campground Home
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);
// Show new Campground Page
router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});
//Create New Campground
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', ' successfully made a new campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//show Campground
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate('reviews');
		if (!campground) {
			req.flash('error', 'Cannot find that Campground');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);
//show campground edit
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash('error', 'Cannot find that Campground');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);
//update campground
router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		req.flash('success', ' Successfully Edited a Campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
//Delete One Campground
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const deletedproduct = await Campground.findByIdAndDelete(id);
		req.flash('success', ' Successfully Deleted Campground');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
