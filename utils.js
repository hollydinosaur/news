const db = require("./db/connection");

exports.createReferenceObj = (arr, param1, param2) => {
	const newObject = {};
	arr.forEach((object) => (newObject[object[param1]] = object[param2]));
	return newObject;
};

exports.formatArray = (arr, refObj, param1, param2) => {
	const newArr = [];
	arr.forEach((element) => {
		const obj = { ...element };
		const val = obj[param1];
		obj[param2] = refObj[val];
		delete obj[param1];
		newArr.push(obj);
	});
	return newArr;
};

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
	const validTopics = ["mitch", "cats", "paper", "*"];
	if (!validTopics.includes(topic)) {
		return Promise.reject({ status: 404, msg: "No such path" });
	} else return topic;
};
