const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics.controller");

topicsRouter
	.route("/")
	.get(getAllTopics)
	.all((req, res) => {
		res.status(405).send({ msg: "Method not allowed" });
	});

module.exports = topicsRouter;
