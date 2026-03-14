deleteTask();
// função para enviar evento de click no botão de excluir
function deleteTask() {
    
    try {
        $(document).on("click", ".control-menu > .delete-button", function() {
            
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
                    location.reload();
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
        $(document).on("click", ".control-menu > .edit-button", function() {
            
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

export default {editButton, deleteTask}