// função para enviar evento de click no botão de excluir
deleteTask();
function deleteTask() {
    
    try {
        $(document).on("click", ".control-menu > .delete-button", function() {
            
            let idTask = $(this).attr("id");

            const clique = {
                idTask
            };
            // envia evento pro backend através do objeto "clique"
            $.ajax({

                url: `/backend/deleteTask/${clique.idTask}`,
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



// função para editar tarefas existentes
function editTask() {
    try {
        // evento de click no botão de editar
        $(document).on("click", ".control-menu > .edit-button", function() {
            // armazena o id do botão clicado
            let idClique = parseInt($(this).attr('class').split(' ')[1]);

           
           // seleciona o botão do form de editar tarefa
            //let sendButton = $(`.enviar-edit`)[0];
            // seleciona o form em específico
            let editForm = $(`.edit-form`)[0];

            // manipulamos o evento de submit do formulário de edição de tarefas com o form selecionado
            $(editForm).on("submit", (e) => {
                e.preventDefault();

                // capturamos os valores digitados nos campos quando o botão é clicado
                let tituloEditado = $(`.edit-title`).val();
                let descEditada = $(`.edit-desc`).val();
                console.log("opa")
                /*
                // lê o atributo "id" do botão de submit
                let idBruto = $(sendButton).attr("id");
                
                // coleta apenas a parte numérica da string
                let somenteId = idBruto.replace(/\D/g, "");
                
                // converte para Number
                let idNumero = parseInt(somenteId)
                */
                // cria um objeto que armazena essas informações
                const edicao = {
                    descEditada,
                    idClique,
                    tituloEditado
                }

                // requisição AJAX para enviar esses dados pro backend
                $.ajax({
    
                    url: `/backend/editTask/${edicao.idClique}`,
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
                
    
                //$(".editForm").remove();
            });
        });


    } catch(e) {
        console.log(e);
    }
}

function abrirMenu() {
    // seleciona o botão de abrir menu
    let menuButton = $(".menu-button");
    // seleciona a div com os links
    let links = $(".hidden-links");

    menuButton.on("click", function() {
        links.toggleClass("hidden-links links")
    })
}

function filtro() {
    // seleciona o botão de filtro e a div com os controles de filtro
    let filterButton = $(".botao-filtro");
    let containerFiltro = $(".hidden-filtrar-tasks");

    // seleciona os botões de filtro "Concluídos" e "Não concluídos"
    let concluidos = $(".concluidos");
    let naoConlcuidos = $(".nao-concluidos");
    let padrao = $(".padrao");

    // seleciona o checkbox da task
    //let taskMarker = $(".controls > input[type='checkbox']");
    
    // função de filtro de tasks que é ativada ao clicar no botão de filtro
    filterButton.on("click", function() {

        // captura os inputs que estão marcados e os que não estão
        let finishedTasks = $(".controls > input[type='checkbox']:checked");
        let notFinishedTasks = $(".controls > input[type='checkbox']:not(:checked)");
        
        // torna a div com controles de filtro visível ao clicar no botão de filtro
        containerFiltro.toggleClass("hidden-filtrar-tasks filtrar-tasks");

        // exibe somente as marcadas como concluído
        concluidos.on("click", function() {
            notFinishedTasks.closest("li").toggleClass("hidden-task-row");
            finishedTasks.closest("li").removeClass("hidden-task-row");

        });

        // exibe somente as não marcadas como concluído
        naoConlcuidos.on("click", function() {
            finishedTasks.closest("li").toggleClass("hidden-task-row");
            notFinishedTasks.closest("li").removeClass("hidden-task-row");

        });

        // torna todas elas visíveis de novo
        padrao.on("click", function() {
            finishedTasks.closest("li").removeClass("hidden-task-row");
            notFinishedTasks.closest("li").removeClass("hidden-task-row");
        });
    });

}

export default {editTask, deleteTask, abrirMenu, filtro};