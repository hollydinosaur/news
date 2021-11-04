const db = require("./db/connection");

exports.sortByFilter = (sortBy) => {
	const sortByCriteria = [
		"title",
		"topic",
		"author",
		"body",
		"created_at",
		"votes",
		"article_id",
	];
	if (!sortByCriteria.includes(sortBy)) {
		return Promise.reject({ status: 400, msg: "Invalid sort by query" });
	} else return sortBy;
};

exports.orderFilter = (order) => {
	const orderCriteria = ["ASC", "DESC"];
	if (!orderCriteria.includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid order query" });
	} else return order;
};

exports.validateTopic = (topic) => {
	const validTopics = ["mitch", "cats", "paper"];
	if (!validTopics.includes(topic)) {
		return Promise.reject({ status: 404, msg: "No such path" });
	} else return topic;
};

exports.validateUsername = (username) => {
	let validatedUsername;
	return db.query(`SELECT username FROM users;`).then((data) => {
		data.rows.forEach((object) => {
			if (object.username === username) {
				validatedUsername = username;
			}
		});
		if (validatedUsername === 0) {
			return Promise.reject({ status: 400, msg: "Invalid Username" });
		}
		return validatedUsername;
	});
};
