const commentsRouter = require("express").Router();
const {
	deleteComment,
	getComments,
	patchCommentById,
} = require("../controllers/comments.controller");
commentsRouter
	.route("/:comment_id")
	.delete(deleteComment)
	.get(getComments)
	.patch(patchCommentById)
	.all((req, res) => {
		res.status(405).send({ msg: "Method not allowed" });
	});

module.exports = commentsRouter;
