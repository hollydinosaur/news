const {
	deleteCommentById,
	getCommentById,
} = require("../models/comments.model");

const deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	deleteCommentById(comment_id)
		.then((data) => {
			res.status(204).send();
		})
		.catch(next);
};

const getComments = (req, res, next) => {
	const { comment_id } = req.params;
	getCommentById(comment_id)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

module.exports = { deleteComment, getComments };
