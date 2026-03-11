let tarefasList = $(".lista");
let descricoes = $(".lista-descricoes");
let body = $("body"); 

async function carregarTarefas() {
    let tarefas = await fetch("http://localhost:3000/tarefas");

    let tarefasData = await tarefas.json();

    try {
        tarefasData.map((task, i) => {
            tarefasList.prepend(`

                <details>
                    <summary>${task.titulo}</summary>
                    <ul>
                        <li>${task.descricao}</li>
                    </ul>
                </details>


            `);
        })
    } catch(e) {
        console.log(e);
    }
}

carregarTarefas();