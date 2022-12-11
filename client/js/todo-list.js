import Dataservice from './Dataservice.js';

async function addTodoHandler(ev) {
    const title = document.querySelector('#newTodoEl').value;

    const ds = new Dataservice(null, null, sessionStorage.getItem('todoListBasicAuth'));

    const result = await ds.createTodo({ completed: false, title });

    if (result.message === 'Successfully created todo') {
        renderTodoListPage();
    }
}

async function completeTodoHandler(ev) {
    if (!document.querySelector('.action-buttons').contains(ev.target)
    && document.querySelector('.action-buttons') !== ev.target) {
        const todoId = ev.target.parentElement.id.split('-')[2];

        const ds = new Dataservice(null, null, sessionStorage.getItem('todoListBasicAuth'));

        const result = await ds.updateTodo(todoId, { completed: !(document.querySelector(`#todo-checkbox-${todoId}`).checked) });

        if (result.message === 'Successfully updated todo') {
            renderTodoListPage();
        }
    }
}

async function deleteTodoHandler(ev) {
    const todoId = ev.target.parentElement.parentElement.parentElement.id.split('-')[2];

    const ds = new Dataservice(null, null, sessionStorage.getItem('todoListBasicAuth'));

    const result = await ds.deleteTodo(todoId);

    if (result.message === 'Successfully deleted todo') {
        renderTodoListPage();
    }
}

function getTodosTilesTemplate(todos) {
    const template = todos.reduce((result, todo) => {
        result +=
        `
            <div class="todo-tile" id="todo-tile-${todo.id}">
               <input type="checkbox" id="todo-checkbox-${todo.id}">
                <label class="${todo.completed ? 'label-crossed' : ''}">
                    ${todo.title}
                </label>

                <div class="action-buttons">
                    <div class="edit action-btn" title="Update">
                        <i class="fa fa-edit" style="font-size:35px"></i>
                    </div>

                    <div class="delete action-btn" title="Delete">
                        <i class="fa fa-trash" style="font-size:35px"></i>
                    </div>
                </div>
            </div>
        `;

        return result;
    }, '');

    return template;
}

function addNewTodoTemplate() {
    return `
        <div class="new-todo-template">
            <input placeholder="Whats your todo" id="newTodoEl">
            <div class="add action-btn" title="Add">
                <i class="fa fa-plus" style="font-size:35px"></i>
            </div>
        </div>
    `
}


export async function renderTodoListPage() {
    const ds = new Dataservice(null, null, sessionStorage.getItem('todoListBasicAuth'));

    const { todos: allTodos } = await ds.getAllTodos();

    const template = `
        <div class="todo-list">
            ${getTodosTilesTemplate(allTodos)}
            ${addNewTodoTemplate()}
        </div>
    `;

    const userDashboard = document.querySelector('.user-dashboard');

    const todoTilesDashboard = document.querySelector('.todo-list');

    if (userDashboard || todoTilesDashboard) {
        document.querySelector('.app-container').innerHTML = '';
    }

    document.querySelector('.app-container').innerHTML = template;

    allTodos.filter(todo => todo.completed === true).forEach(todo => document.querySelector(`#todo-checkbox-${todo.id}`).checked = true);

    Array.from(document.querySelectorAll('.todo-tile label')).forEach(todoTile => todoTile.addEventListener('click', completeTodoHandler));

    Array.from(document.querySelectorAll('.delete')).forEach(deleteBtn => deleteBtn.addEventListener('click', deleteTodoHandler));

    document.querySelector('.add').addEventListener('click', addTodoHandler);
}
