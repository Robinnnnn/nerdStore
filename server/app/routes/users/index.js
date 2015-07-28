'use strict';

var router = require('express').Router(),
		_ = require('lodash'),
		mongoose = require('mongoose')

var HttpError = require('../../utils/HttpError');
var User = mongoose.model('User');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		else {
			req.requestedUser = user;
			next();
		}
	})
	.then(null, next);
});

// Everyone
router.get('/:id', function (req, res, next) {
	res.status(200).json(req.requestedUser)
});

// All Users
router.use(function(req, res, next) {
	if (req.user) return next()
	res.status(401).end()
})

// Current User Or Admin
router.use(function(req, res, next) {
	if (req.user._id == req.requestedUser._id || req.user.isAdmin) return next()
	res.status(401).end()
})

		router.put('/:id', function (req, res, next) {
			_.extend(req.requestedUser, req.body);
			req.requestedUser.save()
			.then(function (user) {
				res.json(user);
			})
			.then(null, next);
		});

		router.delete('/:id', function (req, res, next) {
			req.requestedUser.remove()
			.then(function () {
				res.status(204).end();
			})
			.then(null, next);
		});

// AUTH >>> Admin
router.use(function(req, res, next) {
	if (req.user.isAdmin) return next()
	res.status(401).end()
})

		router.get('/', function (req, res, next) {
				User.find({}).exec()
				.then(function (users) {
					res.json(users);
				})
				.then(null, next);
			}
		);

		router.post('/', function (req, res, next) {
			User.create(req.body)
			.then(function (user) {
				res.status(201).json(user);
			})
			.then(null, next);
		});

module.exports = router;
