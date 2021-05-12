const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const jwtValidator = async (rq, rs, next) => {
	const token = rq.header('x-token');

	if (!token) {
		rs.status(401).json({
			msg: 'No hay token en la petición'
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);
		console.log(uid);
		const authUser = await usuario.findById(uid);
		if (!authUser) {
			throw '';
		}

		if (!authUser.estado) {
			throw '';
		}

		rq.authUser = authUser;
		// console.log(rq.authUser);
		next();
	} catch (error) {
		console.log(error);
		rs.status(401).json({
			msg: 'Token no válido'
		});
	}
};

module.exports = { jwtValidator };
