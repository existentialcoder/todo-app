const SERVER_BASE = 'http://localhost:3000';

class Dataservice {
    constructor(userEmail, userPassword, auth) {
        this.headers = {
            Authorization: `Basic ${auth ? auth : btoa(userEmail + ':' + userPassword)}`,
            'Content-type': 'application/json'
        }
    }

    async getUserDetails() {
        const result = await fetch(`${SERVER_BASE}/api/users`, {
            method: 'GET',
            headers: this.headers
        });

        return result.json();
    }

    async createUser() {
        const result = await fetch(`${SERVER_BASE}/api/users`, {
            method: 'POST',
            body: '{}',
            headers: this.headers
        });

        return result.json();
    }

    async getAllTodos() {
        const result = await fetch(`${SERVER_BASE}/api/todos`, {
            method: 'GET',
            headers: this.headers
        });

        return result.json();
    }

    async createTodo(data) {
        const result = await fetch(`${SERVER_BASE}/api/todos`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.headers
        });

        return result.json();
    }

    async updateTodo(todoId, data) {
        const result = await fetch(`${SERVER_BASE}/api/todos/${todoId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: this.headers
        });

        return result.json();
    }

    async deleteTodo(todoId) {
        const result = await fetch(`${SERVER_BASE}/api/todos/${todoId}`, {
            method: 'DELETE',
            headers: this.headers
        });

        return result.json();
    }
}

export default Dataservice;
