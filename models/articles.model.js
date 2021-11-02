const db = require("../db/connection");

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
		.query(
			`UPDATE articles
	SET votes = $1
	WHERE article_id = $2 RETURNING *`,
			[voteChange, id]
		)
		.then((data) => {
			return data.rows[0];
		});
};
