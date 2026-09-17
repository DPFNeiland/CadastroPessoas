const express = require("express");
const wrap = require("express-async-error-wrapper");
const Pessoa = require("../../models/pessoa");

const router = express.Router();

router.get("/listar", wrap(async (req, res) => {
	const resultado = await Pessoa.listar();

	res.json(resultado);
}));

router.get("/obter", wrap(async (req, res) => {
	const id = parseInt(req.query["id"]);

	const resultado = await Pessoa.obter(id);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

router.post("/criar", wrap(async (req, res) => {
	const resultado = await Pessoa.criar(req.body);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

router.put("/editar", wrap(async (req, res) => {
	const resultado = await Pessoa.editar(req.body);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

router.delete("/excluir", wrap(async (req, res) => {
	const id = parseInt(req.query["id"]);

	const resultado = await Pessoa.excluir(id);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

module.exports = router;
