var Promise = require("bluebird");
var MongoClient = require("mongodb").MongoClient;
var DBConnectionString = process.env.MONGODB_URI;
var DBUser = process.env.MONGODB_USER;
var DBPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
var databaseConnection;

DBConnectionString = DBConnectionString.replace('<USER>', DBUser);
DBConnectionString = DBConnectionString.replace('<PASSWORD>', DBPassword);

console.log(DBConnectionString);

module.exports = {
	createConnection: function () {    
		return MongoClient.connect(DBConnectionString, {
			promiseLibrary: Promise
		});
	},
	setupConnection: function (db) {
		databaseConnection = db;
	},
	getConnection: function () {
		return databaseConnection;
	}
};