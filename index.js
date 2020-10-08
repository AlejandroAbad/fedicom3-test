'use strict';

const URL_SERVICIO = 'http://localhost:5000';
const SOFTWARE_ID = '9003';
const LOGIN = {
	FARMACIA: {
		user: '10107506@hefame',
		password: '1F8C4279',
		debug: true,
		noCache: true
	},
	TRANSFER: {
		user: '60200561',
		password: 'MF7AF4P3',
		debug: true,
		noCache: true
	}
}
const PEDIDO = {
	codigoCliente: "13676",
	numeroPedidoOrigen: "CAMBIAME O ME REPETIRÉ",
	tipoPedido: "028",
	"lineas": [
		{
			"orden": 1,
			"codigoArticulo": "6533093",
			"cantidad": 1,
			"servicioDemorado": false
		},
		{
			"orden": 2,
			"codigoArticulo": "159323",
			"cantidad": 1,
			"servicioDemorado": false
		},
		{
			"orden": 3,
			"codigoArticulo": "8470001593245",
			"cantidad": 1,
			"servicioDemorado": false
		}
	]
}


// const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const expectStatus = (res, status) => expect(res, res.header['x-txid']).to.have.status(status);
const expectBody = (res) => expect(res.body, res.header['x-txid']);


const clone = require('clone');
chai.use(chaiHttp);


// VARIABLES PROCESO

const TOKEN = {
	FARMACIA: '',
	TR: '',
	TG: '',
	TP: ''
}



const GET = (endpoint, token) => {
	let c = chai.request(URL_SERVICIO)
		.get(endpoint)
		.set('Software-ID', SOFTWARE_ID)

	if (token) c.set('Authorization', 'Bearer ' + token)
	return c;
}

const POST = (endpoint, body, token) => {
	let c = chai.request(URL_SERVICIO)
		.post(endpoint)
		.set('Software-ID', SOFTWARE_ID)
		.send(body)

	if (token) c.set('Authorization', 'Bearer ' + token)
	return c;
}

const PUT = (endpoint, body, token) => {
	let c = chai.request(URL_SERVICIO)
		.put(endpoint)
		.set('Software-ID', SOFTWARE_ID)
		.send(body)

	if (token) c.set('Authorization', 'Bearer ' + token)
	return c;
}

describe('AUTENTICACION', () => {

	let ENDPOINT = '/authenticate';

	describe('Forzado de errores básicos', () => {

		let MENSAJE = clone(LOGIN.FARMACIA);
		it('JSON vacio', (done) => {
			let body = {};
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 400);
				expectBody(res).to.deep.equal([
					{ codigo: "AUTH-003", descripcion: "El parámetro \"user\" es obligatorio" },
					{ codigo: "AUTH-004", descripcion: "El parámetro \"password\" es obligatorio" }
				]);
				done();
			});
		});
		it('Sin usuario', (done) => {
			let body = clone(MENSAJE);
			delete body.user;
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 400);
				expectBody(res).to.deep.equal([
					{ codigo: "AUTH-003", descripcion: "El parámetro \"user\" es obligatorio" }
				]);
				done();
			});
		});
		it('Sin password', (done) => {
			let body = clone(MENSAJE);
			delete body.password;
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 400);
				expectBody(res).to.deep.equal([
					{ codigo: "AUTH-004", descripcion: "El parámetro \"password\" es obligatorio" }
				]);
				done();
			});
		});
		it('Petición PUT', (done) => {
			PUT(ENDPOINT).end((err, res) => {
				expectStatus(res, 404);
				expectBody(res).to.deep.equal([
					{ codigo: "HTTP-404", descripcion: "No existe el endpoint indicado." }
				]);
				done();
			});
		});
	});

	describe('Dominio Fedicom', () => {

		let MENSAJE = clone(LOGIN.FARMACIA);

		it('Login OK', (done) => {
			let body = clone(MENSAJE);
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 201);
				expectBody(res).to.have.property('auth_token');
				TOKEN.FARMACIA = res.body.auth_token;
				console.log('Almacenado token de farmacia: ' + TOKEN.FARMACIA);
				done();
			});
		});
		it('Login Incorrecto', (done) => {
			let body = clone(MENSAJE);
			body.password = '1234';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 401);
				expectBody(res).to.deep.equal([
					{ codigo: "AUTH-005", descripcion: "Usuario o contraseña inválidos" }
				]);
				done();
			});
		});
		it('Usuario con caracteres incorrectos al final', (done) => {
			let body = clone(MENSAJE);
			body.user += 'XX';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 401);
				done();
			});
		});
		it('Dominio inexistente, usuario valido', (done) => {
			let body = clone(MENSAJE);
			body.domain = 'XXXXXX';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 201);
				expectBody(res).to.have.property('auth_token');
				done();
			});
		});
		it('Dominio inexistente, usuario NO valido', (done) => {
			let body = clone(MENSAJE);
			body.domain = 'XXXXXX';
			body.password = '1234';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 401);
				done();
			});
		});
		it('Dominio TRANSFER, usuario valido (caso especial, debe autenticar)', (done) => {
			let body = clone(MENSAJE);
			body.domain = 'transfer_laboratorio';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 201);
				expectBody(res).to.have.property('auth_token');
				done();
			});
		});
		it('Dominio TRANSFER, usuario NO valido (caso especial, NO debe autenticar)', (done) => {
			let body = clone(MENSAJE);
			body.domain = 'transfer_laboratorio';
			body.password = '1234';
			POST(ENDPOINT, body).end((err, res) => {
				expectStatus(res, 401);
				done();
			});
		});
		['HEFAME', 'empleado', 'FMAS', 'PORTAL_HEFAME', 'SAP_BG'].forEach(nombreDominio => {
			it('Dominio [' + nombreDominio + '], user/pass validos', (done) => {
				let body = clone(MENSAJE);
				body.domain = nombreDominio;
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});
			});
			it('Dominio [' + nombreDominio + '], contraseña incorrecta', (done) => {
				let body = clone(MENSAJE);
				body.domain = nombreDominio;
				body.password = '1234';
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});
			});
		});

	});

	describe('Dominio Transfer', () => {

		let MENSAJE = clone(LOGIN.TRANSFER);

		['TR', 'TG', 'TP'].forEach(tipoTransfer => {
			it('Transfer tipo [' + tipoTransfer + ']', (done) => {
				let body = clone(MENSAJE);
				body.user = tipoTransfer + body.user;
				POST('/authenticate', body).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('auth_token');
					TOKEN[tipoTransfer] = res.body.auth_token;
					console.log('Almacenado token tipo [' + tipoTransfer + '] : ' + TOKEN[tipoTransfer]);
					done();
				});

			});
			it('Transfer tipo [' + tipoTransfer + '] con contraseña incorrecta', (done) => {

				let body = clone(MENSAJE);
				body.user = tipoTransfer + body.user;
				body.password = '1234';
				POST('/authenticate', body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});

			});
			it('Transfer tipo [' + tipoTransfer + '] con caracteres incorrectos al final del nombre del usuario', (done) => {

				let body = clone(MENSAJE);
				body.user = tipoTransfer + body.user + 'XX';
				POST('/authenticate', body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});

			});

		})

		let tiposMalos = ['T', 'TX', 'TY', 'TT', 'T ', 'XX', 'X', '', 'XXX', 'XXXXXXXXXXXXXXXXX', ' ', '    ', '              ', 'XTR'];
		tiposMalos.forEach(tipoTransfer => {
			it('Transfer de tipo incorrecto [' + tipoTransfer + ']', (done) => {
				let body = clone(MENSAJE);
				body.user = tipoTransfer + body.user
				POST('/authenticate', body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});
			});
		})



	});

});


describe('PEDIDOS', () => {
	for (let tipoToken in TOKEN) {

		describe('TOKEN ' + tipoToken, () => {

			let ENDPOINT = '/pedidos';
			let MENSAJE = clone(PEDIDO);

			it('Pedido estandard', (done) => {

				let body = clone(MENSAJE);
				body.numeroPedidoOrigen = "" + Math.random();
				POST(ENDPOINT, body, TOKEN[tipoToken]).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('numeroPedido');
					done();
				});

			})

		});

	}
})