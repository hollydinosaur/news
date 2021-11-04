const endpoints = require("../endpoints.json");

const getEndpoints = (req, res, next) => {
	return res.status(200).send({ endpoints }).catch(next);
};

module.exports = { getEndpoints };
