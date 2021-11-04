const { getUsers } = require("../models/users.model");
const getAllUsers = (req, res, next) => {
	getUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

module.exports = { getAllUsers };
