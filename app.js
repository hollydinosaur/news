const express = require("express");
const app = express();
app.use(express.json());
const handle500 = require("./controllers/errors.controller");

const apiRouter = require("./routers/api.router.js");

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
	res.status(404).send({ message: "Not found" });
});
// app.use(handle500);
module.exports = app;
