import express from "express";
import connection from "./database.js";
import queryTasks from "./funcoes.js";
const router = express.Router();

// rota GET para exibir tarefas numa div no frontend
router.get("/tarefas", async (req, res) => {
    try {
        const tarefas = await queryTasks();
        res.send(tarefas);
    } catch(err) {
        console.log(err);
    }
});

// método POST para receber as informações vindas do formulário no frontend
// a URL no primeiro parâmetro precisa ser a mesma indicada no atributo "action" da tag "form"

router.post("/", (req, res) => {

    // esse destructuring precisa ter as variáveis iguais aos valores dos atributos "name" nos <input> do HTML
    let { tarefa, descricao } = req.body;
    // esses símbolos de "$" são placeholders, úteis para segurança contra SQL Injection

    const inserir = `INSERT INTO ${process.env.DB_TABLE_NAME} (titulo, descricao) VALUES ($1, $2) RETURNING *`;
    connection.query(inserir, [tarefa, descricao], (err, res) => {
        if (!err) {
            console.log("Dados adicionados");
            // chamamos a função "queryTasks()" para atualizar as informações no console
            queryTasks();
        } else {
            console.log(err)
        }
    });

    // redireciona o usuário para a mesma página após o submit do formulário
    res.redirect("/");
});


// rota DELETE para receber evento de clique no botão de excluir do frontend
router.delete("/deleteTask/:id", async (req, res) => {
    try {
        let id = req.params.id;

        let query = "DELETE FROM tarefas WHERE id = $1";

        await connection.query(query, [id]);

        res.status(200).send({mensagem: "exclusão concluída"});
    } catch(e) {
        res.status(500).send({mensagem: "não foi possível realizar a exclusão"});
    }
});

// rota patch para alterar tarefa no banco de dados
router.patch("/editTask/:id", async (req, res) => {
    let { descEditada, tituloEditado } = req.body;
    let idNumero = req.params.id;

    const query = "UPDATE tarefas SET titulo = $1, descricao = $2 WHERE id = $3";

    await connection.query(query, [tituloEditado, descEditada, idNumero]);

    res.status(200).send({mensagem: "Tarefa editada com sucesso!"});

    res.redirect("/");
});

export default router;