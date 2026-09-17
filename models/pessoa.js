const Sql = require("../data/sql");
const fs = require("node:fs/promises");
const path = require("path");

class Pessoa {
	static validar(pessoa, criacao) {
		if (!pessoa) {
			return "Dados inválidos";
		}

		if (!criacao) {
			pessoa.id = parseInt(pessoa.id);

			if (!pessoa.id) {
				return "Id inválido";
			}
		}

		pessoa.nome = (pessoa.nome || "").normalize().trim();
		if (!pessoa.nome || pessoa.nome.length > 50) {
			return "Nome inválido";
		}

		pessoa.email = (pessoa.email || "").normalize().trim();
		if (!pessoa.email || pessoa.email.length > 50) {
			return "E-mail inválido";
		}

		// O telefone é opcional
		pessoa.telefone = (pessoa.telefone || "").normalize().trim();
		if (!pessoa.telefone) {
			pessoa.telefone = null;
		} else if (pessoa.telefone.length > 50) {
			return "Telefone inválido";
		}

		return null;
	}

	static async criar(pessoa, avatar) {
		const erro = Pessoa.validar(pessoa, true);
		if (erro)
			return erro;

		if(!avatar || !avatar.length) {
			return "Avatar Inválido"
		}

		return await Sql.connect(async (sql) => {
			await sql.query("INSERT INTO pessoa (nome, email, telefone) VALUES (?, ?, ?)", [pessoa.nome, pessoa.email, pessoa.telefone]);

			pessoa.id = await sql.scalar("SELECT last_insert_id()");

			// Volta uma pasta para trás (..) e acessa a public (/public)
			const caminho = path.join(__dirname, "../public/images/avatar/" + pessoa.id + ".jpg")

			await fs.writeFile(caminho, avatar[0].buffer); // salvar

			return pessoa;
		});
	}

	static async editar(pessoa) {
		const erro = Pessoa.validar(pessoa, false);
		if (erro)
			return erro;

		return await Sql.connect(async (sql) => {
			await sql.query("UPDATE pessoa SET nome = ?, email = ?, telefone = ? WHERE id = ?", [pessoa.nome, pessoa.email, pessoa.telefone, pessoa.id]);

			if (!sql.affectedRows) {
				return "Pessoa não encontrada";
			}

			return null;
		});
	}

	static async obter(id) {
		if (!id) {
			return "Id inválido";
		}

		return await Sql.connect(async (sql) => {
			const lista = await sql.query("SELECT id, nome, email, telefone FROM pessoa WHERE id = ?", [id]);

			if (!lista.length) {
				return "Pessoa não encontrada";
			}

			return lista[0];
		});
	}

	static async listar() {
		return await Sql.connect(async (sql) => {
			const lista = await sql.query("SELECT id, nome, email, telefone FROM pessoa ORDER BY id ASC");

			return lista;
		});
	}

	static async excluir(id) {
		if (!id) {
			return "Id inválido";
		}

		return await Sql.connect(async (sql) => {
			await sql.query("DELETE FROM pessoa WHERE id = ?", [id]);

			if (!sql.affectedRows) {
				return "Pessoa não encontrada";
			}

			return null;
		});
	}
}

module.exports = Pessoa;
