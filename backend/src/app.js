require("dotenv").config();
require("module-alias/register");

const express = require("express");
const app = express();
const router = require("./router");
const conn = require("@config/conn");
const connectDB = require("@config/connectDB");
const cors = require("cors");
const allowedOrigins = [
	process.env.FRONTEND_URL,
	process.env.LOCAL_FRONTEND_URL
];

connectDB(conn);

app.use(express.json());

app.listen(process.env.PORT, () =>
	console.log(`Server is running on port ${process.env.PORT}`)
);

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("CORS not allowed"));
			}
		},
		credentials: true
	})
);

app.use("/api", router);
