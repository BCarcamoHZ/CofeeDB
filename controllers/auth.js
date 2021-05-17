const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
	try {
		const { correo, password } = req.body;
		console.log(req.body);
		const usuario = await Usuario.findOne({ correo });
		console.log(usuario.estado);
		if (!usuario || usuario.estado === false) {
			return res.status(400).json({
				msg: 'El usuario o el correo no existen',
				success: false
			});
		}

		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'La contrasela no es correcta',
				success: false
			});
		}

		const token = await generarJWT(usuario.id);

		return res.json({
			success: true,
			usuario,
			token
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Algo ha ido mal',
			success: false
		});
	}
};

const googleSignIn = async (rq, rs) => {
	const { id_token } = rq.body;

	try {
		const { correo, nombre, img } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			const data = { nombre, correo, password: ':P', img, google: true };

			usuario = new Usuario(data);

			await usuario.save();
		}

		if (!usuario.estado) {
			return rs.status(401).json({
				msg: 'Hable con el administrador, usuario bloqueado'
			});
		}

		const token = await generarJWT(usuario.id);

		return rs.json({
			usuario,
			token
		});
	} catch (error) {
		rs.status(400).json({
			msg: 'Token de google no válido'
		});
	}
};

module.exports = { login, googleSignIn };
