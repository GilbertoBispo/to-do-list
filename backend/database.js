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

export default connection