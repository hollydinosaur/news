const articlesRouter = require("express").Router();
const {
	getArticleById,
	updateArticleVotes,
	getAllArticles,
} = require("../controllers/articles.controller");
const articles = require("../db/data/test-data/articles");

articlesRouter.get("/:id", getArticleById);
articlesRouter.patch("/:id", updateArticleVotes);
articlesRouter.get("/", getAllArticles);

module.exports = articlesRouter;
