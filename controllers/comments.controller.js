const {
	deleteCommentById,
	getCommentById,
	updateCommentById,
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

const patchCommentById = (req, res, next) => {
	const { inc_votes } = req.body;
	const { comment_id } = req.params;
	updateCommentById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

module.exports = { deleteComment, getComments, patchCommentById };
