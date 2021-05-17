const categoria = require('../models/categoria');
const producto = require('../models/Producto');
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
	if (!idExists) throw new Error(`This id does not exists`);
};

const categoryIdExists = async (id = '') => {
	const idExists = await categoria.findById(id);
	if (!idExists) throw new Error('This id does not exists');
};

const productIdExists = async (id = '') => {
	const idExists = await producto.findById(id);
	if (!idExists) throw new Error('This id does not exists');
};

module.exports = { isValidRole, emailExists, idExists, categoryIdExists, productIdExists };
