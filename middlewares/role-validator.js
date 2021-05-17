const roleValidator = (rq, rs, next) => {
	if (!rq.authUser) {
		return rs.status(500).json({
			msg: 'Se intenta validar el rol incorrectamente'
		});
	}

	if (rq.authUser.rol !== 'ADMIN_ROLE') {
		return rs.status(401).json({
			msg: 'El usuario no cuenta con los permisos necesarios para la accion'
		});
	}

	return next();
};

const hasRoleValidator = (...roles) => {
	return (rq, rs, next) => {
		if (!rq.authUser) {
			return rs.status(500).json({
				msg: 'Se intenta validar el rol incorrectamente'
			});
		}

		console.log(roles, rq.authUser.rol);

		if (!roles.includes(rq.authUser.rol)) {
			return rs.status(401).json({
				msg: `El usuario no cuenta con los permisos necesarios para la accion: ${roles}`
			});
		}
		next();
	};
};

module.exports = { roleValidator, hasRoleValidator };
