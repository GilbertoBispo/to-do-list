// importação do express e do path
import express from "express";
import path from "path";
// importação do objeto "Client" da biblioteca "pg"
import { Client } from "pg";
// importação do .env
import "dotenv/config";

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

app.get("/taskDesc", async (req, res) => {
    const descricoes = await queryTasks();
    let taskDescriptions = descricoes.map(item => item.descricao);
    
    try {
        res.send(taskDescriptions);
    } catch(e) {
        console.log(e);
    }

});


// iniciando servidor
app.listen(port, () => {
    console.log("executando servidor.");
});