const express = require('express'),
	router = express.Router({ mergeParams: true }),
	catchAsync = require('../utils/catchAsync'),
	ExpressError = require('../utils/ExpressError'),
	{ reviewSchema } = require('../schemas.js'),
	Review = require('../models/review'),
	Campground = require('../models/campground');

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
	else {
		next();
	}
};

router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash('success', ' Created New Review');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', ' Successfully Deleted Review');
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
