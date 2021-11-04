const { query } = require("../db/connection");
const db = require("../db/connection");

exports.getUsers = () => {
	return db.query(`SELECT * FROM users;`).then((data) => {
		return data.rows;
	});
};
