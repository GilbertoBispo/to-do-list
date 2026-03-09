// importação do express e do path
import express from "express";
import path from "path";

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
    console.log(tarefa, descricao);
    res.send("Dados recebidos");
});

// iniciando servidor
app.listen(port, () => {
    console.log("executando servidor.");
});