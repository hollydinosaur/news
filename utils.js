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
		return Promise.reject({ status: 400, msg: "Invalid Request" });
	} else return sortBy;
};

exports.orderFilter = (order = "DESC") => {
	const orderCriteria = ["ASC", "DESC"];
	if (!orderCriteria.includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid Request" });
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
						return Promise.reject({ status: 400, msg: "Invalid Request" });
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
				return Promise.reject({ status: 400, msg: "Invalid Request" });
			}
			return username;
		});
};

exports.validateTopicId = (topicId) => {
	return db
		.query(`SELECT * FROM topics WHERE topic_id = $1;`, [topicId])
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({ status: 400, msg: "Invalid Request" });
			}
			return topicId;
		});
};

exports.validateArticleID = (articleId) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({ status: 400, msg: "Invalid Request" });
			}
			return articleId;
		});
};

exports.validateCommentId = (commentId) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({ status: 400, msg: "Invalid Request" });
			} else return commentId;
		});
};
