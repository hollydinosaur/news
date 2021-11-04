const { query } = require("../db/connection");
const db = require("../db/connection");

exports.getUsers = () => {
	return db.query(`SELECT * FROM users;`).then((data) => {
		return data.rows;
	});
};

exports.getUser = (username) => {
	let validatedUsername = 0;
	return db
		.query(`SELECT username FROM users;`)
		.then((data) => {
			data.rows.forEach((object) => {
				if (object.username === username) {
					validatedUsername = username;
				}
			});
			if (validatedUsername === 0) {
				return Promise.reject({ status: 400, msg: "Bad Request" });
			}
			return validatedUsername;
		})
		.then((validatedUsername) => {
			return db.query(
				`SELECT * FROM users
        WHERE username = $1;`,
				[validatedUsername]
			);
		})
		.then((data) => {
			return data.rows[0];
		});
};
