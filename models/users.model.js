const { query } = require("../db/connection");
const db = require("../db/connection");
const { validateUsername } = require("../utils");

exports.getUsers = () => {
	return db.query(`SELECT * FROM users;`).then((data) => {
		return data.rows;
	});
};

exports.getUser = async (username) => {
	let validatedUsername = await validateUsername(username);
	return db
		.query(
			`SELECT * FROM users
        WHERE username = $1;`,
			[validatedUsername]
		)
		.then((data) => {
			return data.rows[0];
		});
};
