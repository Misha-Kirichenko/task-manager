require("dotenv").config();
require("module-alias/register");

const express = require("express");
const app = express();
const router = require("@root/router");
const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);

app.use(express.json());

app.listen(process.env.PORT, () =>
	console.log(`Server is running on port ${process.env.PORT}`)
);

app.use("/api", router);
