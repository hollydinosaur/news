const articlesRouter = require("express").Router();
const {
	getArticleById,
	updateArticleVotes,
	getAllArticles,
	getComments,
	postComment,
} = require("../controllers/articles.controller");

articlesRouter
	.route("/:id")
	.get(getArticleById)
	.patch(updateArticleVotes)
	.post(postComment)
	.all((req, res) => {
		res.status(405).send({ msg: "Method not allowed" });
	});
articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id/comments", getComments);
module.exports = articlesRouter;
