import { renderUserDashboard } from './user-dashboard.js';

import { renderTodoListPage } from './todo-list.js';

function renderLogoutButton() {
    document.querySelector('#logout').style.display = 'block';
    document.querySelector('#logout').addEventListener('click', () => {
        sessionStorage.removeItem('todoListBasicAuth');

        alert('Succesfully logged out');

        window.location.reload();
    });
}

export function initApplication() {
    const basicAuth = sessionStorage.getItem('todoListBasicAuth');

    document.querySelector('.app-title').textContent = `The Todos List${basicAuth ? ` for ${atob(basicAuth).split(':')[0]}!` : '!'}`;

    if (!basicAuth) {
        renderUserDashboard();
    } else {
        renderLogoutButton();
        renderTodoListPage();
    }
}

document.addEventListener("DOMContentLoaded", initApplication);
