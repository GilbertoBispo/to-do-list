// importação do express e do path
import express from "express";
import path from "path";

// instância do express
const app = express();
const port = 3000;

// permite que a API receba e entenda JSON
app.use(express.json());

// servindo arquivos estáticos

// como estamos usando o ES Modules ("type": "module"; no package.json), precisamos usar "import.meta.dirname" no lugar do "__dirname"

// ao especificar o caminho relativo da pasta onde estão os arquivos do frontend, precisamos separar cada etapa do caminho com vírgulas
app.use("/", express.static(path.join(import.meta.dirname, "../", "frontend", "public")));

// iniciando servidor
app.listen(port, () => {
    console.log("executando servidor.");
});