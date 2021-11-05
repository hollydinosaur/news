const { handle400, handle404 } = require("./controllers/errors.controller");
const db = require("./db/connection");

exports.sortByFilter = (sortBy = "created_at") => {
	const sortByCriteria = [
		"title",
		"topic",
		"author",
		"body",
		"created_at",
		"votes",
		"article_id",
	];
	if (!sortByCriteria.includes(sortBy)) {
		return handle400();
	} else return sortBy;
};

exports.orderFilter = (order = "DESC") => {
	const orderCriteria = ["ASC", "DESC"];
	if (!orderCriteria.includes(order)) {
		return handle400();
	} else return order;
};

exports.validateTopic = (topic) => {
	if (topic === undefined) {
		return topic;
	} else
		return db
			.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
			.then((data) => {
				if (data.rows.length === 0) {
					if (data.rows.length === 0) {
						return handle404();
					}
				}
				return topic;
			});
};

exports.validateUsername = (username) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [username])
		.then((data) => {
			if (data.rows.length === 0) {
				return handle404();
			}
			return username;
		});
};

exports.validateArticleID = (articleId) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
		.then((data) => {
			if (data.rows.length === 0) {
				return handle404();
			}
			return articleId;
		});
};

exports.validateCommentId = (commentId) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
		.then((data) => {
			if (data.rows.length === 0) {
				return handle404();
			} else return commentId;
		});
};
