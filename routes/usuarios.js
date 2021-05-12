const { Router } = require('express');
const { check } = require('express-validator');

const { roleValidator, hasRoleValidator, fieldsValidator, jwtValidator } = require('../middlewares');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { isValidRole, emailExists, idExists } = require('../helpers/db-validators');

const router = Router();

router.get(
	'/',
	[
		check('desde', 'Debe ser un númbero').optional().isNumeric(),
		check('limit', 'Debe ser un numero').optional().isNumeric(),
		fieldsValidator
	],
	usuariosGet
);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password debe ser tener al menos 6 caracteres').isLength({ min: 6 }),
		check('correo', 'El correo no es válido').isEmail(),
		check('correo').custom(emailExists),
		check('rol').custom(isValidRole),
		fieldsValidator
	],
	usuariosPost
);

router.put(
	'/:id',
	[
		check('id', 'this ID is not mongo valid').isMongoId(),
		check('id').custom(idExists),
		check('rol').custom(isValidRole),
		fieldsValidator
	],
	usuariosPut
);

router.delete(
	'/:id',
	[
		jwtValidator,
		//roleValidator,
		hasRoleValidator('ADMIN_ROLE'),
		check('id', 'this ID is not mongo valid').isMongoId(),
		check('id').custom(idExists),
		fieldsValidator
	],
	usuariosDelete
);

router.patch('/', usuariosPatch);

module.exports = router;
