const { Router } = require('express');
const { check } = require('express-validator');
const {
	crearCategorita,
	findAllCategories,
	findCategoryById,
	updateCategory,
	deleteCategory
} = require('../controllers/categorias');
const { categoryIdExists } = require('../helpers/db-validators');
const { jwtValidator, fieldsValidator, hasRoleValidator } = require('../middlewares');

const router = Router();

router.get(
	'/',
	[
		check('desde', 'Debe ser un númbero').optional().isNumeric(),
		check('limit', 'Debe ser un numero').optional().isNumeric(),
		fieldsValidator
	],
	findAllCategories
);

router.get(
	'/:id',
	[
		jwtValidator,
		check('id', 'this ID is not mongo valid').isMongoId(),
		check('id').custom(categoryIdExists),
		fieldsValidator
	],
	findCategoryById
);

router.post(
	'/',
	[ jwtValidator, check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(), fieldsValidator ],
	crearCategorita
);

router.put(
	'/:id',
	[
		jwtValidator,
		hasRoleValidator('ADMIN_ROLE'),
		check('id', 'this ID is does not mongo valid').isMongoId(),
		check('id').custom(categoryIdExists),
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		fieldsValidator
	],
	updateCategory
);

router.delete(
	'/:id',
	[
		jwtValidator,
		//roleValidator,
		hasRoleValidator('ADMIN_ROLE'),
		check('id', 'this ID is not mongo valid').isMongoId(),
		check('id').custom(categoryIdExists),
		fieldsValidator
	],
	deleteCategory
);

module.exports = router;
