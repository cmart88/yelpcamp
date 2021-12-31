const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./AppError');
// app.use(morgan('comon'));
app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	next();
});
app.use('/dogs', (req, res, next) => {
	console.log('I love dogs');
	next();
});
const verifyPassword = (req, res, next) => {
	const { password } = req.query;

	// password === 'chickennugget' ? next(): throw new Error('Password required');
	if (password === 'chickennugget') {
		next();
	}
	throw new AppError('Password Required', 401);
};

// app.get('/secret', verifyPassword, (req, res) => {
// 	res.send('you found the secret');
// });
app.get('/', (req, res) => {
	res.send('Home Page');
});
// app.get('/dogs', (req, res) => {
// 	res.send('WOOF WOOF');
// });

app.get('/error', (req, res) => {
	chicken.fly();
});

app.get('/dogs', (req, res) => {
	console.log(`REQUEST DATE: ${req.requestTime}`);
	res.send('WOOF WOOF!');
});

app.get('/secret', verifyPassword, (req, res) => {
	res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to anyone');
});

// app.get('/admin', (req, res) => {
//     throw new AppError('You are not an Admin!', 403)
// })

// app.use((req, res) => {
// 	res.status(404).send('NOT FOUND!');
// });

app.use((err, req, res, next) => {
	console.log('******************************************');
	console.log('*****************ERROR*****************');
	console.log('******************************************');
	console.log(err);
	next(err);
});

app.listen(8080, () => {
	console.log('App is running on localhost:8080');
});
