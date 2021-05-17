const { Router } = require('express');
const { check } = require('express-validator');
const {
	createProduct,
	findAllProducts,
	findProductById,
	updateProduct,
	deleteProduct
} = require('../controllers/productos');
const { categoryIdExists, productIdExists } = require('../helpers/db-validators');
const { jwtValidator, fieldsValidator, hasRoleValidator } = require('../middlewares');

const router = Router();

router.get(
	'/',
	[
		jwtValidator,
		check('desde', 'Debe ser un númbero').isNumeric(),
		check('limit', 'Debe ser un numero').isNumeric(),
		fieldsValidator
	],
	findAllProducts
);

router.get(
	'/:id',
	[
		jwtValidator,
		check('id', 'this ID is not mongo valid').isMongoId(),
		check('id').custom(productIdExists),
		fieldsValidator
	],
	findProductById
);

router.post(
	'/',
	[
		jwtValidator,
		check('nombre', 'El nombre es obligatorio').notEmpty(),
		check('precio', 'El precio es obligatorio').isFloat(),
		check('categoria', 'La Categoria es obligatoria').notEmpty(),
		check('descripcion', 'La descripcion es obligatoria').notEmpty(),
		check('disponible', 'El campo "disponible" es obligatorio').isBoolean(),
		check('categoria').custom(categoryIdExists),
		fieldsValidator
	],
	createProduct
);

router.put(
	'/:id',
	[
		jwtValidator,
		hasRoleValidator('ADMIN_ROLE'),
		check('id', 'this ID is does not mongo valid').isMongoId(),
		check('id').custom(productIdExists),
		check('nombre', 'El nombre es obligatorio').notEmpty(),
		check('precio', 'El precio es obligatorio').isFloat(),
		check('categoria', 'La Categoria es obligatoria').notEmpty(),
		check('descripcion', 'La descripcion es obligatoria').notEmpty(),
		check('disponible', 'El campo "disponible" es obligatorio').isBoolean(),
		check('categoria').custom(categoryIdExists),
		fieldsValidator
	],
	updateProduct
);

router.delete(
	'/:id',
	[
		jwtValidator,
		hasRoleValidator('ADMIN_ROLE'),
		check('id', 'this ID is does not mongo valid').isMongoId(),
		check('id').custom(productIdExists)
	],
	deleteProduct
);

module.exports = router;
