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
			return data.rows[0];
		});
};
