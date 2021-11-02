const { fetchArticleById } = require("../models/articles.model");

const getArticleById = (req, res) => {
	const { id } = req.params;
	fetchArticleById(id).then((article) => {
		console.log({ article });
		res.status(200).send({ article });
	});
};

module.exports = { getArticleById };
