const {
	fetchArticleById,
	changeArticleVotes,
	fetchAllArticles,
	fetchComments,
	commentPost,
} = require("../models/articles.model");
const { validateUsername } = require("../utils");

const getArticleById = (req, res, next) => {
	const { id } = req.params;
	return fetchArticleById(id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const updateArticleVotes = (req, res, next) => {
	const { id } = req.params;
	const { inc_votes } = req.body;
	return changeArticleVotes(id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const getAllArticles = (req, res, next) => {
	const { sort_by, order, topic, limit, p } = req.query;
	return fetchAllArticles(sort_by, order, topic, limit, p)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

const getComments = (req, res, next) => {
	const { article_id } = req.params;
	fetchComments(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

const postComment = (req, res, next) => {
	const { id } = req.params;
	const { username, body } = req.body;
	return commentPost(id, username, body)
		.then((comment) => {
			res.status(201).send(comment);
		})
		.catch(next);
};

module.exports = {
	getArticleById,
	updateArticleVotes,
	getAllArticles,
	getComments,
	postComment,
};
