const getArticleById = (req, res) => {
	console.log("in controller");
	fetchArticleById(id).then((data) => {
		res.status(200).send(data);
	});
};

module.exports = { getArticleById };
