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

const VALORES_TOCAWEBOS = [
	true, false, '', ' ', '		', /^a/g, {}, [], { a: true }, [0, '2'], null, undefined, 0, -1, NaN
]

const DOMINIOS_NO_TOKENS = [
	"empleado", "FMAS", "PORTAL_HEFAME", "SAP_BG", "INTERFEDICOM"
]

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
		it('JSON vacio (sin usuario ni password)', (done) => {
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

		it(`Campo USUARIO no existe`, (done) => {
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

		// Probando valores raros en el campo 'username'
		VALORES_TOCAWEBOS.forEach((vMierda, iMierda) => {
			it(`Valores de mierda en el USUARIO #${iMierda}: [${vMierda}]`, (done) => {
				let body = clone(MENSAJE);
				body.user = vMierda;
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 400);
					expectBody(res).to.deep.equal([
						{ codigo: "AUTH-003", descripcion: "El parámetro \"user\" es obligatorio" }
					]);
					done();
				});
			});
		});

		it(`Campo PASSWORD no existe`, (done) => {
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

		VALORES_TOCAWEBOS.forEach((vMierda, iMierda) => {
			it(`Valores de mierda en el PASSWORD #${iMierda}: [${vMierda}]`, (done) => {
				let body = clone(MENSAJE);
				body.password = vMierda;
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 400);
					expectBody(res).to.deep.equal([
						{ codigo: "AUTH-004", descripcion: "El parámetro \"password\" es obligatorio" }
					]);
					done();
				});
			});
		});

		// Dominios para los que no se permite la generación de tokens
		DOMINIOS_NO_TOKENS.forEach((nombreDominio, indice) => {
			it(`Dominio no apto para generar TOKENS #${indice}: [${nombreDominio}]`, (done) => {
				let body = clone(MENSAJE);
				body.domain = nombreDominio;
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 400);
					expectBody(res).to.deep.equal([
						{ codigo: "AUTH-999", descripcion: "No se permite la expedición de tokens para el dominio" }
					]);
					done();
				});
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

		it('Petición GET', (done) => {
			GET(ENDPOINT).end((err, res) => {
				expectStatus(res, 404);
				expectBody(res).to.deep.equal([
					{ codigo: "HTTP-404", descripcion: "No existe el endpoint indicado." }
				]);
				done();
			});
		});
	});

	[true, false].forEach((usarCache) => {
		describe(`Dominio Fedicom - Caché de usuarios=${usarCache}`, () => {

			let MENSAJE = clone(LOGIN.FARMACIA);
			MENSAJE.noCache = !usarCache;

			it('Login OK', (done) => {
				let body = clone(MENSAJE);
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('auth_token');
					TOKEN.FARMACIA = res.body.auth_token;
					//console.log('>> Almacenado token de farmacia: ' + TOKEN.FARMACIA);
					done();
				});
			});
			if (usarCache) {
				it('Login OK - Repetición: Fuerza uso de la caché', (done) => {
					let body = clone(MENSAJE);
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 201);
						expectBody(res).to.have.property('auth_token');
						TOKEN.FARMACIA = res.body.auth_token;
						//console.log('>> Almacenado token de farmacia: ' + TOKEN.FARMACIA);
						done();
					});
				});
			}
			it(`Login Incorrecto${usarCache ? ' - Falla en caché, luego consulta a SAP' : ''}`, (done) => {
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
					expectBody(res).to.deep.equal([
						{ codigo: "AUTH-005", descripcion: "Usuario o contraseña inválidos" }
					]);
					done();
				});
			});
			it('Usuario con caracteres de espacios al inicio', (done) => {
				let body = clone(MENSAJE);
				body.user = '  ' + body.user;
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('auth_token');
					done();
				});
			});
			it('Usuario con caracteres de espacios al final', (done) => {
				let body = clone(MENSAJE);
				body.user += '  ';
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('auth_token');
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
			it('Dominio inexistente, contraseña incorrecta', (done) => {
				let body = clone(MENSAJE);
				body.domain = 'XXXXXX';
				body.password = '1234';
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 401);
					expectBody(res).to.deep.equal([
						{ codigo: "AUTH-005", descripcion: "Usuario o contraseña inválidos" }
					]);
					done();
				});
			});
			it('Dominio TRANSFER, con usuario NO TRANSFER - usuario valido (caso especial, debe autenticar)', (done) => {
				// A la hora de auntenticar, el dominio "FEDICOM" y "transfer_laboratorio" se autentican de la misma manera.
				let body = clone(MENSAJE);
				body.domain = 'transfer_laboratorio';
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('auth_token');
					done();
				});
			});
			it('Dominio TRANSFER, con usuario NO TRANSFER - usuario NO valido (caso especial, NO debe autenticar)', (done) => {
				let body = clone(MENSAJE);
				body.domain = 'transfer_laboratorio';
				body.password = '1234';
				POST(ENDPOINT, body).end((err, res) => {
					expectStatus(res, 401);
					done();
				});
			});


		});
	});


	[true, false].forEach((usarCache) => {
		describe(`Dominio Transfer - Caché de usuarios=${usarCache}`, () => {

			let MENSAJE = clone(LOGIN.TRANSFER);
			MENSAJE.noCache = !usarCache;

			['TR', 'TG', 'TP'].forEach(tipoTransfer => {
				it('Transfer tipo [' + tipoTransfer + ']', (done) => {
					let body = clone(MENSAJE);
					body.user = tipoTransfer + body.user;
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 201);
						expectBody(res).to.have.property('auth_token');
						TOKEN[tipoTransfer] = res.body.auth_token;
						//console.log('Almacenado token tipo [' + tipoTransfer + '] : ' + TOKEN[tipoTransfer]);
						done();
					});

				});

				if (usarCache) {
					it('Transfer tipo [' + tipoTransfer + '] - Repetición: Fuerza uso de la caché', (done) => {
						let body = clone(MENSAJE);
						body.user = tipoTransfer + body.user;
						POST(ENDPOINT, body).end((err, res) => {
							expectStatus(res, 201);
							expectBody(res).to.have.property('auth_token');
							TOKEN[tipoTransfer] = res.body.auth_token;
							//console.log('Almacenado token tipo [' + tipoTransfer + '] : ' + TOKEN[tipoTransfer]);
							done();
						});

					});
				}

				it('Transfer tipo [' + tipoTransfer + '] con contraseña incorrecta', (done) => {

					let body = clone(MENSAJE);
					body.user = tipoTransfer + body.user;
					body.password = '1234';
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 401);
						done();
					});

				});
				it('Transfer tipo [' + tipoTransfer + '] con caracteres incorrectos al final del nombre del usuario', (done) => {

					let body = clone(MENSAJE);
					body.user = tipoTransfer + body.user + 'XX';
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 401);
						done();
					});

				});

			})

			// Transfers malos
			let tiposMalos = ['T', ' T', 'XX', 'X', '', 'XXX', 'XXXXXXXXXXXXXXXXX', ' ', '    ', '              ', 'XTR'];
			tiposMalos.forEach(tipoTransfer => {
				it('Transfer de tipo incorrecto [' + tipoTransfer + ']', (done) => {
					let body = clone(MENSAJE);
					body.user = tipoTransfer + body.user
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 401);
						done();
					});
				});
			});

			// Estos transfer son malos, pero SAP los da como buenos
			let tiposMalosPeroNo = ['TX', 'TY', 'TT', 'T ', ' T '];
			tiposMalosPeroNo.forEach(tipoTransfer => {
				it('Transfer de tipo incorrecto pero que SAP da bueno [' + tipoTransfer + ']', (done) => {
					let body = clone(MENSAJE);
					body.user = tipoTransfer + body.user
					POST(ENDPOINT, body).end((err, res) => {
						expectStatus(res, 201);
						expectBody(res).to.have.property('auth_token');
						done();
					});
				});
			})

		});

	});
});

/*
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
*/