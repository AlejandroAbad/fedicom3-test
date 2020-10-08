'use strict';

// const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const expectStatus = (res, status) => expect(res, res.header['x-txid']).to.have.status(status);
const expectBody = (res) => expect(res.body, res.header['x-txid']);


const clone = require('clone');
chai.use(chaiHttp);




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



// VARIABLES PROCESO


const URL_SERVICIO = 'https://fedicom3-dev.hefame.es';
const SOFTWARE_ID = '9003';
const LOGIN = {
	user: '10107506@hefame',
	password: '1F8C4279',
	debug: true,
	noCache: true
}

const PEDIDOS = {

	STANDARD: {
		"codigoCliente": "4718",
		"lineas": [
			{
				"codigoArticulo": "8470000018596",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470000048821",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470000070730",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470000334993",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001463166",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001527295",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001529251",
				"cantidad": 24,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001529275",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001529282",
				"cantidad": 4,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001529299",
				"cantidad": 4,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001529312",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001548450",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001571694",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001571700",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001582676",
				"cantidad": 5,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001583161",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001583178",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001651365",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001651372",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001651389",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001659491",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001725370",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001730442",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001733214",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001740755",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001775115",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001789969",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001790644",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001924155",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470001954497",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470002998834",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470003231183",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470004178654",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470004698091",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470004716726",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470004822991",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470004823158",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006590652",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006592816",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006597149",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006617533",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006620397",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006620823",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006643983",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006649282",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006695159",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006719954",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006732441",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006777091",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006821206",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006856284",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006897867",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470006992647",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007005384",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007006688",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007019121",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007019176",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007026839",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007031949",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007045571",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007050469",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007091554",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007128748",
				"cantidad": 5,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007216056",
				"cantidad": 3,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007230984",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007239444",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007250289",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007295662",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007316794",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007452812",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007581512",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470007905271",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008224944",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008404889",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008532186",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008669479",
				"cantidad": 2,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008822096",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470008879762",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009116934",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009158842",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009160074",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009617639",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009772987",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			},
			{
				"codigoArticulo": "8470009986254",
				"cantidad": 1,
				"servicioDemorado": false,
				"fechaLimiteServicio": ""
			}
		]
	},

	TRANSFER: {
		"codigoCliente": "4718",
		"numeroPedidoOrigen": "2218",
		"tipoPedido": "000099",
		"lineas": [
			{
				"codigoArticulo": "8470002031364",
				"cantidad": 1,
				"servicioDemorado": false,
				"orden": 1
			},
			{
				"codigoArticulo": "8470002358461",
				"cantidad": 1,
				"servicioDemorado": false,
				"orden": 2
			},
			{
				"codigoArticulo": "8470006545720",
				"cantidad": 2,
				"servicioDemorado": false,
				"orden": 3
			},
			{
				"codigoArticulo": "8470006548479",
				"cantidad": 3,
				"servicioDemorado": false,
				"orden": 4
			},
			{
				"codigoArticulo": "8470006621974",
				"cantidad": 1,
				"servicioDemorado": false,
				"orden": 5
			},
			{
				"codigoArticulo": "8470007216162",
				"cantidad": 2,
				"servicioDemorado": false,
				"orden": 6
			},
			{
				"codigoArticulo": "8470008013241",
				"cantidad": 1,
				"servicioDemorado": false,
				"orden": 7
			},
			{
				"codigoArticulo": "8470009385484",
				"cantidad": 1,
				"servicioDemorado": false,
				"orden": 8
			}
		],
		"login": {
			"username": "10104718@hefame",
			"domain": "FEDICOM"
		},
		"crc": "C8B4534A8A8ADA4964213B98",
		"sap_url_confirmacion": "http://f3san1.hefame.es:5000/confirmaPedido",
		"incidencias": []
	}
}

let TOKEN = '';




describe('PEDIDOS', () => {

	it('Generacion de token', (done) => {
		let body = clone(LOGIN);
		POST('/authenticate', body).end((err, res) => {
			expectStatus(res, 201);
			expectBody(res).to.have.property('auth_token');
			TOKEN = res.body.auth_token;
			console.log('Almacenado token de farmacia: ' + TOKEN);
			done();
		});
	})

	const NUMPEDORI = (new Date()).toISOString();

	describe('Machaque de pedidos', () => {
		for (let i = 0; i < 2000; i++) {

			let numeroPedidoOrigen = NUMPEDORI + '-' + i;

			let hacerTransfer = Math.random() <= 0.01;


			it('Pedido ' + (hacerTransfer ? 'Transfer ' : '') + numeroPedidoOrigen, (done) => {

				let body = clone(PEDIDOS.STANDARD);


				let rnd = Math.random();
				let numLineas = Math.max(1, Math.floor(body.lineas.length * rnd));
				body.lineas = body.lineas.slice(0, numLineas);
				body.numeroPedidoOrigen = numeroPedidoOrigen;
				if (hacerTransfer) body.tipoPedido = "099";

				POST('/pedidos', body, TOKEN).end((err, res) => {
					expectStatus(res, 201);
					expectBody(res).to.have.property('numeroPedido');
					done();
				});

			});






		}
	})


})