const articlesRouter = require("express").Router();
const {
	getArticleById,
	updateArticleVotes,
} = require("../controllers/articles.controller");
const articles = require("../db/data/test-data/articles");

articlesRouter.get("/:id", getArticleById);
articlesRouter.patch("/:id", updateArticleVotes);

module.exports = articlesRouter;
