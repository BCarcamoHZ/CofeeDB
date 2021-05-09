const Role = require('../models/role');
const Usuario = require('../models/usuario');

const isValidRole = async (rol = '') => {
	const rolExists = await Role.findOne({ rol });
	if (!rolExists) {
		throw new Error(`El rol ${rol} no está registrado en la BD`);
	}
};

const emailExists = async (correo = '') => {
	const emailExists = await Usuario.findOne({ correo });
	if (emailExists) throw new Error(`This email already exists`);
};

const idExists = async (id = '') => {
	const idExists = await Usuario.findById(id);
	if (!idExists) throw new Error(`This id not exists`);
};

module.exports = { isValidRole, emailExists, idExists };
