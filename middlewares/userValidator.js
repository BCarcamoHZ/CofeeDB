const { validationResult } = require('express-validator');

const userValidator = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json(error);
	}

	next();
};

module.exports = {
	userValidator
};
