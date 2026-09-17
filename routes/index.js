const express = require("express");
const wrap = require("express-async-error-wrapper");

const router = express.Router();

router.get("/", wrap(async (req, res) => {
	res.render("index/index");
}));

router.get("/cadastro", wrap(async (req, res) => {
	res.render("index/cadastro");
}));

module.exports = router;
