let tarefasList = $(".lista");
let descricoes = $(".lista-descricoes");

async function carregarTarefas() {
    let tarefas = await fetch("http://localhost:3000/tarefas");
    
    let tarefasData = await tarefas.json();

    try {
        tarefasData.map(task => {
            tarefasList.prepend(`
                <details class='toggle'>
                    <summary>
                    ${task.titulo}
                        <button class='deleteButton' id='${task.id}'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ed736b" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                        <button class='editButton' id='${task.id}'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                        </button>
                    </summary>
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

carregarTarefas()

deleteTask();
// função para enviar evento de click no botão de excluir
function deleteTask() {
    
    try {
        $(document).on("click", "summary > .deleteButton", function() {
            
            let idTask = $(this).attr("id");

            const clique = {
                idTask
            };
            // envia evento pro backend através do objeto "clique"
            $.ajax({

                url: `http://localhost:3000/deleteTask/${clique.idTask}`,
                type: "DELETE",
                contentType: "application/json",
                data: JSON.stringify(clique),

                success: function(response) {
                    console.log("Sucesso ", response);
                    $(`#${clique.idTask}`).closest("details").remove();
                },
                error: function(err) {
                    console.log("Erro ", err);
                }
            });
        });
        
    } catch(e) {
        console.log(e);
    }
}

editButton();

// função para editar tarefas existentes
function editButton() {
    try {
        // evento de click no botão de editar
        $(document).on("click", "summary > .editButton", function() {
            
            // armazena o id do botão clicado
            let idClique = $(this).attr("id");
            // cria um objeto que contém essa informação
            const clique = {
                idClique
            }
            
            // faz aparecer um form para editar tarefa
            $(this).after(`
                <form class='editForm' id='editForm${clique.idClique}'>
                    <input class='editTask' id='editTask${clique.idClique}' type="text" name="tarefaEditada" placeholder="Editar nome da tarefa" autocomplete="off">
                    <input class='editDesc' id='editDesc${clique.idClique}' type="text" name="descricaoEditada" placeholder="Editar descrição" autocomplete="off">
                    <input class='sendIcon' id='sendButton${clique.idClique}' id='${clique.idClique}' type="submit" value="Enviar">
                </form> 
            `);
            
            // seleciona o botão do form de editar tarefa
            let sendButton = $(`#sendButton${clique.idClique}`)[0];
            
            // seleciona o form em específico
            let editForm = $(`#editForm${clique.idClique}`)[0];

            // manipulamos o evento de submit do formulário de edição de tarefas com o form selecionado
            $(editForm).on("submit", (e) => {
                e.preventDefault();

                // capturamos os valores digitados nos campos quando o botão é clicado
                let tituloEditado = $(`.editForm > #editTask${clique.idClique}`).val();
                let descEditada = $(`.editForm > #editDesc${clique.idClique}`).val();

                // lê o atributo "id" do botão de submit
                let idBruto = $(sendButton).attr("id");
                
                // coleta apenas a parte numérica da string
                let somenteId = idBruto.replace(/\D/g, "");

                // converte para Number
                let idNumero = parseInt(somenteId)
                
                // cria um objeto que armazena essas informações
                const edicao = {
                    descEditada,
                    idNumero,
                    tituloEditado
                }

                // requisição AJAX para enviar esses dados pro backend
                $.ajax({
    
                    url: `http://localhost:3000/editTask/${edicao.idNumero}`,
                    type: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(edicao),

                    success: function(response) {
                        console.log("Sucesso ", response);
                        location.reload();
                    },
                    error: function(err) {
                        console.log("Erro ", err);
                    }
                })
                
    
                $(".editForm").remove();
            });
        });


    } catch(e) {
        console.log(e);
    }
}