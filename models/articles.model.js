const { query } = require("../db/connection");
const db = require("../db/connection");
const { sortByFilter, orderFilter } = require("../utils");

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
	topic,
	limit = 10,
	p = 1
) => {
	let verifiedSortBy = await sortByFilter(sortBy);
	let verifiedOrder = await orderFilter(order);
	const offset = (p - 1) * +limit;
	const params = [+limit, offset];

	let queryStr = `SELECT articles.*, COUNT (comments.comment_id) AS comment_count
	FROM articles
	LEFT JOIN comments ON comments.article_id = articles.article_id`;
	let endQuery = ` GROUP BY articles.article_id
	ORDER BY ${verifiedSortBy} ${verifiedOrder} 
	LIMIT $1 OFFSET $2;`;
	if (topic === undefined) {
		queryStr += endQuery;
	} else {
		queryStr += ` WHERE topic = $3` + endQuery;
		params.push(topic);
	}
	return db.query(queryStr, params).then((data) => {
		if (data.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "No such path" });
		}
		return data.rows;
	});
};

exports.fetchComments = (id) => {
	return db
		.query(
			`SELECT articles.created_at, articles.author, articles.body, comments.comment_id, comments.votes 
	FROM articles
	JOIN comments ON comments.article_id = articles.article_id
	WHERE articles.article_id = $1;`,
			[id]
		)
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "No such path",
				});
			}
			return data.rows;
		});
};

exports.commentPost = (id, username, comment) => {
	validatedID = 0;
	validatedUsername = 0;
	return db
		.query(`SELECT username FROM users;`)
		.then((data) => {
			data.rows.forEach((object) => {
				if (object.username === username) {
					validatedUsername = username;
				}
			});
			if (validatedUsername === 0) {
				return Promise.reject({ status: 400, msg: "Invalid Username" });
			}
		})
		.then((validatedUsername) => {
			return db.query(`SELECT article_id FROM articles;`).then((data) => {
				data.rows.forEach((object) => {
					if (object.article_id === +id) {
						validatedID = id;
					}
				});
				if (validatedID === 0) {
					return Promise.reject({ status: 400, msg: "Invalid article ID" });
				}
			});
		})
		.then((validatedUsername, validatedId) => {
			return db.query(
				`INSERT INTO comments
	(body, author, article_id)
	VALUES
	($1, $2, $3)
	RETURNING*`,
				[comment, validatedUsername, validatedId]
			);
		})

		.then((data) => {
			return data.rows[0];
		});
};
