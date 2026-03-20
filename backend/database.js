// importação do objeto "Client" da biblioteca "pg"
import pkg from "pg";
const { Pool } = pkg;
// importação do .env
import "dotenv/config";

// Verificamos se a URL contém 'localhost'. Se sim, desativamos o SSL.
const isLocalhost = process.env.DATABASE_URL?.includes('localhost');
// criamos uma instância de Client e passamos um objeto dentro com os atributos "host", "user", "port" (que podem ser vistos nas propriedades do pgAdmin), "password" e "database". Essas informações devem ser definidas no .env
const connection = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false } 
    /*
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    */
});

// esse método conecta nosso projeto ao banco de dados
connection.connect().then(() => { console.log("bando de dados conectado!") });

export default connection