
var message = document.getElementsByClassName('pcy-message')[0];

if (message && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
	message.style.visibility = "hidden";
}

window.onscroll = function(ev) {
    if (message && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        message.style.visibility = "hidden";
    } else {
		message.style.visibility = "visible";
	}
};

window.onresize = function(event) {
    if (message && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        message.style.visibility = "hidden";
    } else {
		message.style.visibility = "visible";
	}
};

var scrollBottom = function () {
	window.scrollTo(0, window.innerHeight);
};

var showHideSpinner = function (show) {
	var spinner = document.getElementsByClassName('spinner-overlay')[0];
	if (show) {
		spinner.style.display = "flex";
	} else {
		spinner.style.display = "none";
	}
};

var getFormValues = function () {
	return {
		firstName: document.getElementById('firstName').value,
		lastName: document.getElementById('lastName').value,
		honeyPot: document.getElementById('poot').value
	};
};

var checkForm = function () {
	var guest = getFormValues();
	if (guest.firstName === '' || guest.lastName === '' || guest.honeyPot !== '') {
		return false;
	} else {
		return true;
	}
};

var captchaApproved = false;
var captcha = function() {
    captchaApproved = true;
};
var captchaExpire = function () {
	captchaApproved = false;
};
var captchaError = function () {
	captchaApproved = false;
};

var reject = function () {

	if (!captchaApproved) {
		alert('Buen intento robot!');
		return;
	}

	if (!checkForm()) {
		alert('Todos los espacios son requeridos');
		return;
	}

	if (confirm("Seguro que no desea asistir?")) {
		var guest = getFormValues();

		showHideSpinner(true);
	
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {

			var response = JSON.parse(this.response);

			if (this.readyState == 4 && this.status == 200) {
				if (response.success) {
					$('#confirmation').modal('hide');
					alert('Recibimos su respuesta, muchas gracias!');
				} else {
					alert('Hubo un error, por favor trate más tarde');
				}
			} else if (this.status >= 600) {
				alert('Error: ' + response.errMsg);
			}
	
			showHideSpinner(false);
		};
		xhttp.onerror = function () {
			alert('Hubo un error, por favor revise su internet o contacte a Anne');
		};
		xhttp.open("POST", "/reject", false);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify(guest));
	}
};

var approve = function () {

	if (!captchaApproved) {
		alert('Buen intento robot!');
		return;
	}

	if (!checkForm()) {
		alert('Todos los espacios son requeridos');
		return;
	}

	var guest = getFormValues();

	showHideSpinner(true);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		var response;

		response = JSON.parse(this.response);

		if (this.readyState == 4 && this.status == 200) {
			if (response.success) {
				$('#confirmation').modal('hide');
				alert('Confirmado! Lo esperamos!');
			} else {
				alert('Hubo un error, por favor trate más tarde');
			}
		} else if (this.status >= 600) {
			alert('Error: ' + response.errMsg);
		}

		showHideSpinner(false);
	};

	xhttp.onerror = function () {
		alert('Hubo un error, por favor revise su internet o contacte a Anne');
	};
	xhttp.open("POST", "/approve", false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(guest));
};

var getFormValuesList = function () {
	return {
		password: document.getElementById('password').value,
		honeyPot: document.getElementById('poot').value
	};
};

var checkFormList = function () {
	var guest = getFormValuesList();
	if (guest.password === '' || guest.honeyPot !== '') {
		return false;
	} else {
		return true;
	}
};

var sendList = function () {
	if (!captchaApproved) {
		alert('Buen intento robot!');
		return;
	}

	if (!checkFormList()) {
		alert('Todos los espacios son requeridos');
		return;
	}
	var listAuth = getFormValuesList();
	showHideSpinner(true);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {

		var response = JSON.parse(this.response);

		if (this.readyState == 4 && this.status == 200) {
			if (response.success) {
				alert('Lista Enviada!');
			} else {
				alert('Hubo un error, por favor trate más tarde');
			}
		} else if (this.status >= 600) {
			alert('Error: ' + response.errMsg);
		}

		showHideSpinner(false);
	};
	xhttp.onerror = function () {
		alert('Hubo un error, por favor revise su internet o contacte a Anne');
	};
	xhttp.open("POST", "/send-list", false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(listAuth));
};