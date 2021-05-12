const roleValidator = require('../middlewares/role-validator');
const fieldsValidator = require('../middlewares/userValidator');
const jwtValidator = require('../middlewares/jwtValidator');

module.exports = {
	...roleValidator,
	...fieldsValidator,
	...jwtValidator
};
