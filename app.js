const express = require('express'),
	path = require('path'),
	app = express(),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	morgan = require('morgan'),
	ejsMate = require('ejs-mate'),
	catchAsync = require('./utils/catchAsync'),
	ExpressError = require('./utils/ExpressError'),
	{ campgroundSchema, reviewSchema } = require('./schemas.js'),
	Review = require('./models/review'),
	campgrounds = require('./routes/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser    : true,
	useUnifiedTopology : true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

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

app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
	res.render('home');
});
app.post(
	'/campgrounds/:id/reviews',
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
app.delete(
	'/campgrounds/:id/reviews/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found!!', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh no something went wrong!';
	res.status(statusCode).render('error', { err });
});
app.listen(3000, () => {
	console.log('server running on port 3000');
});
