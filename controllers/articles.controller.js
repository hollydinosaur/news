const {
	fetchArticleById,
	changeArticleVotes,
	fetchAllArticles,
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
			res.status(201).send({ article });
		})
		.catch(next);
};

const getAllArticles = (req, res, next) => {
	const { sort_by } = req.query;
	const { order } = req.query;
	const { topic } = req.query;
	fetchAllArticles(sort_by, order, topic)
		.then((articles) => {
			res.status(200).send(articles);
		})
		.catch(next);
};

module.exports = { getArticleById, updateArticleVotes, getAllArticles };
