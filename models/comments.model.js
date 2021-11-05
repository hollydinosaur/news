const { query } = require("../db/connection");
const db = require("../db/connection");
const { validateCommentId } = require("../utils");

exports.deleteCommentById = async (id) => {
	await validateCommentId(id);
	return db
		.query(
			`DELETE FROM comments
        WHERE comment_id = $1 RETURNING*;`,
			[id]
		)
		.then((data) => {
			return data.rows;
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

exports.updateCommentById = async (id, voteChange) => {
	await validateCommentId(id);
	return db
		.query(`SELECT votes FROM comments WHERE comment_id = $1`, [id])
		.then((data) => {
			return Number(data.rows[0].votes) + Number(voteChange);
		})
		.then((votes) => {
			return db
				.query(
					`UPDATE comments 
			SET votes = $1
			WHERE comment_id = $2 RETURNING*;`,
					[votes, id]
				)
				.then((data) => {
					return data.rows[0];
				});
		});
};
