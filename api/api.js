// ------------------------------
//  Imports
// ------------------------------
var responses = require('./utils/apiResponses.utils');
var Promise = require("bluebird");
var mail = require('../config/mail');
var mongoXlsx = require('mongo-xlsx');
var fs = require('fs');

// ------------------------------
//  Private
// ------------------------------


// ------------------------------
//  Public
// ------------------------------

module.exports = {
  
	approve: function (req, res) {
		if (!req.body || !req.body.firstName || req.body.firstName === '') {
			return responses.customErrorResponse(res, 600);
		}

		if (!req.body || !req.body.lastName || req.body.lastName === '') {
			return responses.customErrorResponse(res, 601);
		}

		if (!req.body || req.body.honeyPot !== '') {
			return responses.customErrorResponse(res, 602);
		}

		req.db.collection('Invitado').find({firstName: req.body.firstName, lastName: req.body.lastName}).toArray()
			.then(function (guest) {
				return new Promise(function(resolve, reject) {
					if (guest.length === 0) {
						reject({code: 603});
					} else {
						resolve(guest[0])
					}
				});
			})
			.then(function (guest) {
				return req.db.collection('Invitado').updateOne({firstName: guest.firstName, lastName: guest.lastName}, {$set: {
					status: 'Accept'
				}});
			})
			.then(function() {
				responses.successResponse(res, {'success': true});
			})
			.catch(function (e) {
				console.error(e);
				responses.errorResponse(res, e);
			});

	},

	reject: function (req, res) {
		if (!req.body || !req.body.firstName || req.body.firstName === '') {
			return responses.customErrorResponse(res, 600);
		}

		if (!req.body || !req.body.lastName || req.body.lastName === '') {
			return responses.customErrorResponse(res, 601);
		}

		if (!req.body || req.body.honeyPot !== '') {
			return responses.customErrorResponse(res, 602);
		}

		req.db.collection('Invitado').find({firstName: req.body.firstName, lastName: req.body.lastName}).toArray()
			.then(function (guest) {
				return new Promise(function(resolve, reject) {
					if (guest.length === 0) {
						reject({code: 603});
					} else {
						resolve(guest[0])
					}
				});
			})
			.then(function (guest) {
				return req.db.collection('Invitado').updateOne({firstName: guest.firstName, lastName: guest.lastName}, {$set: {
					status: 'Reject'
				}});
			})
			.then(function() {
				responses.successResponse(res, {'success': true});
			})
			.catch(function (e) {
				console.error(e);
				responses.errorResponse(res, e);
			});

	}

};