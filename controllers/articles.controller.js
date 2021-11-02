const {
	fetchArticleById,
	changeArticleVotes,
} = require("../models/articles.model");

const getArticleById = (req, res, next) => {
	const { id } = req.params;
	fetchArticleById(id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const updateArticleVotes = (req, res, next) => {
	const { id } = req.params;
	const { inc_votes } = req.body;
	changeArticleVotes(id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
module.exports = { getArticleById, updateArticleVotes };
