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
	.all((req, res) => {
		res.status(405).send({ msg: "Method not allowed" });
	});
articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id/comments", getComments);
articlesRouter.post("/:id/comments", postComment);
module.exports = articlesRouter;
