const usersRouter = require("express").Router();
const {
	getAllUsers,
	getUserByUsername,
	getAllCommentsByUser,
} = require("../controllers/users.controller");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.get("/:username/comments", getAllCommentsByUser);

module.exports = usersRouter;
