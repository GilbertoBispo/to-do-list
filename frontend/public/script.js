import funcoes from "./funcoes.js";
// chamada da função principal
carregarTarefas();

let tarefasList = $(".lista");
// let descricoes = $(".lista-descricoes");

// função principal
async function carregarTarefas() {
    let tarefas = await fetch("http://localhost:3000/tarefas");
    
    let tarefasData = await tarefas.json();
    
    try {
        tarefasData.map(task => {
            tarefasList.prepend(`
                <li>
                <div class='task-row'>
                <div class='task-row-data'>
                <h3>${task.titulo}</h3>
                <p>${task.descricao}</p>
                </div>
                <div class='controls'>
                <input type='checkbox'>
                </input>
                <button class='menu-task-button'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                </svg>
                </button>
                <div class='control-menu hidden-menu-tasks'>
                <button class='delete-button' id='${task.id}'>Deletar</button>
                <button class='edit-button ${task.id}'>Editar</button>
                </div>
                </div>
                </div>
                </li>
                `);

            });
            
            let menuTaskButtons = $(".menu-task-button");
            let hiddenMenuTasks = $(".hidden-menu-tasks");
            console.log(menuTaskButtons);   
            
            menuTaskButtons.on("click", function() {
                $(this).next(hiddenMenuTasks).toggleClass("hidden-menu-tasks menu-tasks");
                
            });
            
            // funcionalidade para editar tarefas
            
            let editTaskDiv = $(".hidden-edit-task");
            let editTaskButton = $(".control-menu > .edit-button");
            // let enviarEdit = $(".enviar-edit");
            
            editTaskButton.on("click", function() {
                editTaskDiv.toggleClass("hidden-edit-task edit-task");
                
            })
            let cancelEdit = $(".cancel-edit");
            
            cancelEdit.on("click", function() {
                editTaskDiv.toggleClass("edit-task hidden-edit-task");
                
            });
            
            // chamada de funções externas
            funcoes.deleteTask();
            funcoes.editTask();
            funcoes.abrirMenu();
            funcoes.filtro()
            
        } catch(e) {
            console.log(e);
    }
}


// funcionalidade para adicionar tarefas

let adicionarTarefa = $(".nova-tarefa");
let formTarefas = $(".hidden-adicionar-tarefa");

adicionarTarefa.on("click", () => {
    formTarefas.toggleClass("hidden-adicionar-tarefa adicionar-tarefa");
});