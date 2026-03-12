// importação do express e do path
import express from "express";
import path from "path";
// importação do objeto "Client" da biblioteca "pg"
import { Client } from "pg";
// importação do .env
import "dotenv/config";

// instância do express
const app = express();
const port = 3000;

// permite que a API receba e entenda JSON
app.use(express.json());
// permite que o express leia dados enviados por formulários
app.use(express.urlencoded({ extended: true }));

// servindo arquivos estáticos
// como estamos usando o ES Modules ("type": "module"; no package.json), precisamos usar "import.meta.dirname" no lugar do "__dirname"
// ao especificar o caminho relativo da pasta onde estão os arquivos do frontend, precisamos separar cada etapa do caminho com vírgulas
app.use("/", express.static(path.join(import.meta.dirname, "../", "frontend", "public")));

// criamos uma instância de Client e passamos um objeto dentro com os atributos "host", "user", "port" (que podem ser vistos nas propriedades do pgAdmin), "password" e "database". Essas informações devem ser definidas no .env
const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// esse método conecta nosso projeto ao banco de dados
connection.connect().then(() => { console.log("bando de dados conectado!") });

// aqui nós fazemos um "query" (uma "consulta") no banco de dados que especificamos usando o método .query(). O primeiro atributo é o comando SQL, o segundo é uma callback que possui dois argumentos: "err" e "res", que representam os estados de erro e sucesso da tarefa (eles precisam ser especificados nessa ordem).
async function queryTasks() {
    try {
        // a função espera essa tarefa resolver e atribui a "res"
        const res = await connection.query(`SELECT * FROM ${process.env.DB_TABLE_NAME}`);
        
        // retorna os dados que queremos
        return res.rows; 
    } catch(e) {
        console.log("Erro na query:", e);
        throw e;
    }
}


// método POST para receber as informações vindas do formulário no frontend
// a URL no primeiro parâmetro precisa ser a mesma indicada no atributo "action" da tag "form"

app.post("/", (req, res) => {

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

// rota GET para exibir tarefas numa div no frontend
app.get("/tarefas", async (req, res) => {
    try {
        const tarefas = await queryTasks();
        res.send(tarefas);
    } catch(err) {
        console.log(err);
    }
});

// rota DELETE para receber evento de clique no botão de excluir do frontend
app.delete("/deleteTask/:id", async (req, res) => {
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
app.patch("/editTask/:id", async (req, res) => {
    let { descEditada, tituloEditado } = req.body;
    let idNumero = req.params.id;

    const query = "UPDATE tarefas SET titulo = $1, descricao = $2 WHERE id = $3";

    await connection.query(query, [tituloEditado, descEditada, idNumero]);

    res.status(200).send({mensagem: "Tarefa editada com sucesso!"});

    res.redirect("/");
});

// iniciando servidor
app.listen(port, () => {
    console.log("executando servidor.");
});