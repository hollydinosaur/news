const { fetchAllTopics } = require("../models/topics.models");

const getAllTopics = (req, res, next) => {
	console.log("in controller");
	fetchAllTopics().then((data) => {
		res.status(200).send(data);
	});
};

module.exports = { getAllTopics };
