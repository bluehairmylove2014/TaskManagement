const REST_API_SERVER = 'https://spring-green-magpie-tam.cyclic.app';

// Task management
export function getAllTasksApi(authToken) {
    return fetch(`${REST_API_SERVER}/api/v1/task/getAllTasks`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    })
}

export function getTaskByNamesApi(authToken, task_name) {
    const query = `?task_name=${task_name}`;
    return fetch(`${REST_API_SERVER}/api/v1/task/getAllTaskByNames${query}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    });
}

export function deleteTaskApi(task_id, authToken) {
    return fetch(`${REST_API_SERVER}/api/v1/task/deleteTask`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            tid: task_id
        })
    });
}

export function editTaskApi(task_id, task_data, authToken) {
    return fetch(`${REST_API_SERVER}/api/v1/task/editTask`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ task_id, task_data })
    });
}

export function createNewTaskApi(user_id, task_data, authToken) {
    return fetch(`${REST_API_SERVER}/api/v1/task/createNewTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ user_id, task_data })
    });
}

// Authentication api
export function loginApi(email, password) {
    return fetch(`${REST_API_SERVER}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
}

export function registerApi(email, password) {
    return fetch(`${REST_API_SERVER}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
}

export function checkLoginApi(authToken) {
    return fetch(`${REST_API_SERVER}/api/v1/auth/checkLogin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });
}