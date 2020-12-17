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
				if (typeof e.code !== 'undefined') {
					responses.customErrorResponse(res, e.code);
				} else {
					responses.errorResponse(res, e);
				}
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
				if (typeof e.code !== 'undefined') {
					responses.customErrorResponse(res, e.code);
				} else {
					responses.errorResponse(res, e);
				}
			});

	},

	sendList: function (req, res) {

		if (!req.body || !req.body.password || req.body.password === '') {
			return responses.customErrorResponse(res, 604);
		} else if (req.body.password !== process.env.GET_LIST_PASSWORD) {
			return responses.customErrorResponse(res, 605);
		}

		if (!req.body || req.body.honeyPot !== '') {
			return responses.customErrorResponse(res, 602);
		}

		req.db.collection('Invitado').find().sort({ status: 1 }).toArray()
			.then(function (guests) {
				return new Promise(function (resolve, reject) {
					var model = mongoXlsx.buildDynamicModel(guests);
					mongoXlsx.mongoData2Xlsx(guests, model, function(err, data) {
						if (err) {
							  return reject(err);
						}
						return resolve(data.fullPath);
					});
				});
			})
			.then(function (urlPath) {
				return mail.sendInvitationList(urlPath);
			})
			.then(function (fullPath) {
				return new Promise(function (resolve, reject) {
					fs.unlink(fullPath, function (err) {
						if (err) {
							return reject(err);
						}
				
						return resolve();
					});
				});
			}).then(function () {
				responses.successResponse(res, {'success': true});
			})
			.catch(function (e) {
				console.error(e);
				if (typeof e.code !== 'undefined') {
					responses.customErrorResponse(res, e.code);
				} else {
					responses.errorResponse(res, e);
				}
			});

	}

};