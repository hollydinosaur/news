const commentsRouter = require("express").Router();
const {
	deleteComment,
	getComments,
} = require("../controllers/comments.controller");
commentsRouter
	.route("/:comment_id")
	.delete(deleteComment)
	.get(getComments)
	.all((req, res) => {
		res.status(405).send({ msg: "Method not allowed" });
	});

module.exports = commentsRouter;
