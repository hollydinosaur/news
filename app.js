const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routers/api.router.js");

app.use("/api", apiRouter);

module.exports = app;
