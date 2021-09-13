const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./routes.js/auth");
const { MONGOURI } = require("./keys");

app.use(express.json());
app.use(cors());

mongoose.connect(MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use("/", auth);
mongoose.connection.on("connected", () => {
	console.log("connected to mongo db !!");
});

app.get("/", (req, res) => {
	res.send("Home Page");
});

app.listen(PORT, () => {
	console.log(`Listening on Port "${PORT}"`);
});
