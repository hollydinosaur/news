const { fetchArticleById } = require("../models/articles.model");

const getArticleById = (req, res) => {
	const { id } = req.params;
	fetchArticleById(id).then((data) => {
		res.status(200).send(data);
	});
};

module.exports = { getArticleById };
