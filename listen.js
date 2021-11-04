// const { listen } = require("./app");
const app = require("./app");
const { PORT = 9090 } = process.env;

console.log(app);

app.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Listening on ${PORT}...`);
});
