import connection from "./database.js";

// aqui nós fazemos um "query" (uma "consulta") no banco de dados que especificamos usando o método .query(). O primeiro atributo é o comando SQL, o segundo é uma callback que possui dois argumentos: "err" e "res", que representam os estados de erro e sucesso da tarefa (eles precisam ser especificados nessa ordem).
export default async function queryTasks() {
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