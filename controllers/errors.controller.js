exports.handleCustom = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Invalid Request" });
	} else next(err);
};

exports.handle500 = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Server error" });
};

exports.handle400 = (err, req, res, next) => {
	return Promise.reject({ status: 400, msg: "Invalid Request" });
};

exports.handle404 = (err, req, res, next) => {
	return Promise.reject({ status: 404, msg: "Invalid Path" });
};
