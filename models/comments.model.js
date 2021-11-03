const { query } = require("../db/connection");
const db = require("../db/connection");

exports.deleteCommentById = (id) => {
	return db
		.query(
			`DELETE FROM comments
        WHERE comment_id = $1 RETURNING*;`,
			[id]
		)
		.then((data) => {
			if (data.rows.length === 0) {
				return Promise.reject({ status: 400, msg: "Bad Request" });
			} else return data.rows;
		});
};

exports.getCommentById = (id) => {
	return db
		.query(
			`SELECT * FROM comments
	WHERE comment_id = $1`,
			[id]
		)
		.then((data) => {
			return data.rows;
		});
};
