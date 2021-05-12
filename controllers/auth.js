const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generate-jwt');

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

module.exports = { login };
