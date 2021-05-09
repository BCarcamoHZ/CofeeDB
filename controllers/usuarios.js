const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
	const { limit = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [ total, usuarios ] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).skip(desde).limit(limit)
	]);

	res.json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
	const { nombre, correo, password, rol } = req.body;

	const usuario = new Usuario({ nombre, correo, rol });

	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	await usuario.save();

	res.json({
		usuario
	});
};

const usuariosPut = async (req = request, res = response) => {
	const { id } = req.params;

	const { password, google, correo, ...rest } = req.body;

	if (password) {
		const salt = bcryptjs.genSaltSync();
		rest.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, rest);

	res.json({
		msg: 'put API - controlador',
		usuario
	});
};

const usuariosPatch = (req, res = response) => {
	res.json({
		msg: 'patch API - controlador'
	});
};

const usuariosDelete = (req, res = response) => {
	res.json({
		msg: 'delete API - controlador'
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete
};
