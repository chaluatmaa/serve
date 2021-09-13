const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");

router.get("/", (req, res) => {
	res.send("ROUTER");
});

router.post("/signUp", (req, res) => {
	const { name, email, password } = req.body;
	if (!email || !password || !name) {
		return res.status(422).json({
			message: "Please add all the fields",
		});
	}
	User.findOne({ email: email }).then((savedUser) => {
		if (savedUser)
			return res.status(422).json({
				message: "User already exists",
			});
		bcrypt
			.hash(password, 12)
			.then((hashedPassword) => {
				const user = new User({
					email,
					name,
					password: hashedPassword,
				});
				user.save().then((save) => {
					res.json({
						message: "user saved successfully",
					});
				});
			})
			.catch((err) => {
				res.json({
					err: err,
				});
			});
	});
});

router.post("/signIn", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(422).json({
			message: "Please fill all the fields",
		});
	}
	User.findOne({ email: email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.status(422).json({
					message: "Invalid Credentials",
				});
			}
			bcrypt
				.compare(password, savedUser.password)
				.then((doMatch) => {
					if (doMatch) {
						const token = jwt.sign(
							{
								_id: savedUser._id,
							},
							JWT_SECRET
						);
						const { _id, name, email } = savedUser;
						res.json({
							token,
							user: { _id, name, email },
						});
						console.log("saved user");
					} else {
						res.json({
							message: " Invalid credentials",
						});
						console.log("invalid");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {});
});

module.exports = router;
