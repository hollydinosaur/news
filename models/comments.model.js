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

exports.updateCommentById = async (id, voteChange) => {
	await validateCommentId(id);
	return db
		.query(`SELECT votes FROM comments WHERE comment_id = $1`, [id])
		.then((data) => {
			if (data.rows[0] === undefined) {
				return Promise.reject({ status: 404, msg: "Not found" });
			} else return Number(data.rows[0].votes) + Number(voteChange);
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
