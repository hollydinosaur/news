const express = require("express");
const app = express();
const {
	handle500,
	handleCustom,
	handlePsqlErrors,
} = require("./controllers/errors.controller");
const apiRouter = require("./routers/api.router.js");
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
	res.status(200).send({ msg: "Welcome to my news API" });
});
// ERROR HANDLING
app.use(handleCustom);
app.use(handlePsqlErrors);
app.use(handle500);
app.all("/*", (req, res, next) => {
	res.status(404).send({ msg: "Not found" });
});

module.exports = app;
