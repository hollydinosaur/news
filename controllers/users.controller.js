const { getUsers, getUser } = require("../models/users.model");
const getAllUsers = (req, res, next) => {
	getUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

const getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	getUser(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

module.exports = { getAllUsers, getUserByUsername };
