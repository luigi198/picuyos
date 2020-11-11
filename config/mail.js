var sendinblue = require('sendinblue-api');
var responses = require('../api/utils/apiResponses.utils');
var Promise = require('bluebird');
var fs = require('fs');

var parameters = { "apiKey": process.env.SENDINBLUE_API_KEY };	//Optional parameter: Timeout in MS
var sendinObj = new sendinblue(parameters);

var dataTemplate = {
	"to" : {},
	"from" : [],
	"subject" : "",
	"html" : ""
};

var getTemplate = function () {
	var aux = {};
	for (var x in dataTemplate) {
		aux[x] = dataTemplate[x];
	}
	return aux;
};

var encodeFileToBase64 = function (file) {
	// read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

var sendInvitationList = function (path, confirmados, total, to) {
	return new Promise(function (resolve, reject) {
		var emailBody = getTemplate();
		emailBody.to[to] = to;
		emailBody.from.push('lcordoba@admicondo.com');
		emailBody.from.push('Luis Córdoba');
		emailBody.subject = 'Lista de Invitados';
		emailBody.attachment = {'listaInvitados.xlsx': encodeFileToBase64(path)};
		emailBody.html = '<h1>La lista de Invitados actualizada</h1>';
		sendinObj.send_email(emailBody, function (err, data) {
			if (err) {
				return reject(err);
			}
			return resolve(path);
		});
	});
};

module.exports = {
  sendInvitationList: sendInvitationList
};