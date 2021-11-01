const db = require("../db/connection");

exports.fetchAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		console.log(rows);
		return rows;
	});
};
