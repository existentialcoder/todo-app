import Dataservice from './Dataservice.js';

import { initApplication } from './app.js';

function getUserDetails() {
    return {
        userEmail: document.querySelector('#userEmail').value,
        userPassword: document.querySelector('#userPassword').value
    }
}

function isEmailValid(email) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    return emailRegex.test(email);
}


async function loginHandler() {
    const { userEmail, userPassword } = getUserDetails();

    if (userEmail && userEmail.length > 0 && userPassword && userPassword.length > 0) {
        if (isEmailValid(userEmail)) {
            const ds = new Dataservice(userEmail, userPassword);

            const result = await ds.getUserDetails();

            if (result.message === 'Authentication Error') {
                return alert('Failed to login. Check the credentials');
            }

            alert('Login Successful!');
        
            sessionStorage.setItem('todoListBasicAuth', btoa(userEmail + ':' + userPassword))

            initApplication();
        } else {
            alert('Invalid Email');
        }
    } else {
        alert('Please fill out the credentials');
    }
}

async function signupHandler() {
    const { userEmail, userPassword } = getUserDetails();

    if (userEmail && userEmail.length > 0 && userPassword && userPassword.length > 0) {
        if (isEmailValid(userEmail)) {
            const ds = new Dataservice(userEmail, userPassword);

            const result = await ds.createUser();

            if (result.message === 'Authentication Error') {
                return alert('Failed to signup. Check the credentials');
            }

            if (result.message === 'User already exists') {
                return alert(`Signup failed! ${result.message}`);
            }

            alert('Signup Successful!');
        
            window.loggedInDetails = {
                ...(window.loggedInDetails || {}),
                basicAuth: btoa(userEmail + ':' + userPassword)
            };
        } else {
            alert('Invalid Email');
        }
    } else {
        alert('Please fill out the credentials');
    }
}

export function renderUserDashboard() {
    const template = `
        <div class="user-dashboard">
            <div class="title">
                User Dashboard - Login / Signup
            </div>

            <div class="user-form">
                <div class="user-input"><input id="userEmail" placeholder="User Email"></div>
                <div class="user-input"><input id="userPassword" placeholder="User Password" type="password"></div>
                <div class="user-form-btn-group">
                    <button class="user-form-btn" id="login">
                        Login
                    </button>

                    <button class="user-form-btn" id="signup">
                        Signup
                    </button>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.app-container').innerHTML = template;

    document.querySelector('#login').addEventListener('click', loginHandler);
    document.querySelector('#signup').addEventListener('click', signupHandler);
}
