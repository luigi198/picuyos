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
		return new Promise(function (resolve, reject) {
			MongoClient.connect(DBConnectionString, function(err, client) {
				if (err) reject();
				databaseConnection = client.db('anne-will-wedding');
				resolve();
			});
		});
	},
	getConnection: function () {
		return databaseConnection;
	}
};

// let MongoClient = require('mongodb').MongoClient;
// MongoClient.connect('mongodb://localhost:27017', function(err, client){
//   if(err) throw err;
//   let db = client.db('myTestingDb');
//   db.collection('customers').find().toArray(function(err, result){
//     if(err) throw err;
//     console.log(result);
//     client.close();
//     });
//  });