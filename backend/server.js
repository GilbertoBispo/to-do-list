// importação do express e do path
import express from "express";
import path from "path";
import router from "./routes.js";
import cors from "cors";


// instância do express
const app = express();
const port = 3000;
app.use(cors())

// permite que a API receba e entenda JSON
app.use(express.json());
// permite que o express leia dados enviados por formulários
app.use(express.urlencoded({ extended: true }));

// rotas
app.use("/backend", router);
// servindo arquivos estáticos
// como estamos usando o ES Modules ("type": "module"; no package.json), precisamos usar "import.meta.dirname" no lugar do "__dirname"
// ao especificar o caminho relativo da pasta onde estão os arquivos do frontend, precisamos separar cada etapa do caminho com vírgulas
app.use(express.static(path.join(import.meta.dirname, "../", "frontend", "public")));

/* iniciando servidor
app.listen(port, () => {
    console.log("executando servidor.");
});
*/

export default app;