const { query } = require("../db/connection");
const db = require("../db/connection");
const {
	sortByFilter,
	orderFilter,
	validateTopic,
	validateArticleID,
	validateUsername,
} = require("../utils");

exports.fetchArticleById = async (id) => {
	await validateArticleID(id);
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
			return data.rows[0];
		});
};

exports.changeArticleVotes = async (id, voteChange) => {
	await validateArticleID(id);
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
	topic,
	limit = 10,
	p = 1
) => {
	order = order.toUpperCase();
	await sortByFilter(sortBy);
	await orderFilter(order);
	await validateTopic(topic);
	const offset = (p - 1) * +limit;
	const params = [+limit, offset];

	let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT (comments.comment_id) AS comment_count
	FROM articles
	LEFT JOIN comments ON comments.article_id = articles.article_id`;
	let endQuery = ` GROUP BY articles.article_id
	ORDER BY ${sortBy} ${order} 
	LIMIT $1 OFFSET $2;`;
	if (topic === undefined) {
		queryStr += endQuery;
	} else {
		queryStr += ` WHERE topic = $3` + endQuery;
		params.push(topic);
	}
	return db.query(queryStr, params).then((data) => {
		return data.rows;
	});
};

exports.fetchComments = async (id) => {
	await validateArticleID(id);
	return db
		.query(
			`SELECT comments.created_at, comments.author, comments.body, comments.comment_id, comments.votes 
			FROM articles
			JOIN comments ON comments.article_id = articles.article_id
			WHERE articles.article_id = $1;`,
			[id]
		)
		.then((data) => {
			return data.rows;
		});
};

exports.commentPost = async (id, username, comment) => {
	await validateArticleID(id);
	await validateUsername(username);
	return db
		.query(
			`INSERT INTO comments
			(body, author, article_id)
				VALUES
			($1, $2, $3)
			RETURNING*`,
			[comment, username, id]
		)
		.then((data) => {
			return data.rows[0];
		});
};
