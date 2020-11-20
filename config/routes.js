// controllers
// var main = require('../app/controllers/main')
var api = require('../api/api')
var path = require('path');

// -----------------------
// Expose
// -----------------------

module.exports = function(app, db) {
  
  app.use(function (req, res, next) {
    req.db = db;
    next()
  });

  //
  // API
  //
//   app.post('/lista', api.getList);
//   app.get('/byname/:firstName/:secondName/:lastName', api.getByName);
//   app.post('/loadCode', api.codeVerification);
//   app.post('/addGuest', api.addGuest);
//   app.post('/removeGuest', api.removeGuest);
  
//   // Listado de invitados
//   app.get('/lista', function (req, res) {
//     res.sendFile(path.join(__dirname, '../public', 'invitados.html'));
//   });

	app.post('/approve', api.approve);
	app.post('/reject', api.reject);

  	// index
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});

}