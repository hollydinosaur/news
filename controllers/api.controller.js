const endpoints = require("../newsendpoints.json");

const getEndpoints = (req, res, next) => {
	return res.status(200).send({ endpoints });
};

module.exports = { getEndpoints };
