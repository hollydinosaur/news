const db = require("../db/connection");

exports.fetchArticleById = (id) => {
	return db
		.query(
			`SELECT articles.author, articles.body, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, comments.comment_id
        FROM articles 
        JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        WHERE articles.article_id = $1;`,
			[id]
		)
		.then((data) => {
			console.log(data.rows);
			return data.rows;
		});
};
