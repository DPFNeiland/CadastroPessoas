const express = require("express");
const wrap = require("express-async-error-wrapper");
const Pessoa = require("../../models/pessoa");
const multer = require("multer");

const router = express.Router();

// Os arquivos ficarão armazenados temporariamente na memória RAM do servidor
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

// Cria um middleware para receber um campo de arquivo 
const middleware = upload.fields([
	{ name: "avatar", maxCount: 1 },
]);

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

router.post("/criar", middleware, wrap(async (req, res) => {
	const resultado = await Pessoa.criar(req.body, req.files['avatar']);

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
