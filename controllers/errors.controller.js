exports.handle500 = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ message: "Server error" });
};
