const roleValidator = require('../middlewares/role-validator');
const fieldsValidator = require('./fieldsValidator');
const jwtValidator = require('../middlewares/jwtValidator');

module.exports = {
	...roleValidator,
	...fieldsValidator,
	...jwtValidator
};
