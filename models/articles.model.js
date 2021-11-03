const db = require("../db/connection");
const { sortByFilter, orderFilter, validateTopic } = require("../utils");

exports.fetchArticleById = (id) => {
	return db
		.query(
			`SELECT articles.*, COUNT (comments.comment_id) AS comment_count
        FROM articles 
        JOIN comments ON comments.article_id = articles.article_id
		WHERE articles.article_id = $1
		GROUP BY articles.article_id;`,
			[id]
		)
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "Article ID not found" });
			} else return data.rows[0];
		});
};

exports.changeArticleVotes = (id, voteChange) => {
	return db
		.query(`SELECT votes FROM articles WHERE article_id = $1`, [id])
		.then((data) => {
			return Number(data.rows[0].votes) + Number(voteChange);
		})
		.then((votes) => {
			return db
				.query(
					`UPDATE articles
		SET votes = $1
		WHERE article_id = $2 RETURNING *`,
					[votes, id]
				)
				.then((data) => {
					return data.rows[0];
				});
		});
};

exports.fetchAllArticles = async (
	sortBy = "created_at",
	order = "DESC",
	topic
) => {
	let verifiedSortBy = await sortByFilter(sortBy);
	let verifiedOrder = await orderFilter(order);
	let params = [];
	if (topic === undefined) {
		queryStr = `SELECT articles.*, COUNT (comments.comment_id) AS comment_count
		FROM articles 
		JOIN comments ON comments.article_id = articles.article_id
		GROUP BY articles.article_id
		ORDER BY ${verifiedSortBy} ${verifiedOrder};`;
	} else {
		queryStr = `SELECT articles.*, COUNT (comments.comment_id) AS comment_count
		FROM articles 
		JOIN comments ON comments.article_id = articles.article_id
		WHERE topic = $1
		GROUP BY articles.article_id
		ORDER BY ${verifiedSortBy} ${verifiedOrder};`;
		params.push(topic);
	}
	return db.query(queryStr, params).then((data) => {
		if (data.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "No such path" });
		}
		return data.rows;
	});
};
