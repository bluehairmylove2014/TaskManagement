// Service
import {
    getAllTasksApi,
    getTaskByNamesApi,
    createNewTaskApi,
    editTaskApi,
    deleteTaskApi,
} from './Api';
import UserService from './UserService';

/**
 * Service class for managing tasks.
 * This service follows the Singleton design pattern to provide a single instance across the application.
 */
class TaskService {
    static instance = null;

    /**
     * Get the singleton instance of TaskService.
     * @returns {TaskService} The instance of TaskService.
     */
    static getInstance() {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }

    serviceHandleGetAllTasks = () => {
        return new Promise((resolve, reject) => {
            const authToken = UserService.getAuthToken();
            if (!authToken) {
                resolve({ status_code: 403 });
            }
            else {
                getAllTasksApi(authToken)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(res.status);
                        }
                        return res.json();
                    })
                    .then(data => {
                        resolve({ data, status_code: 200 });
                    })
                    .catch(error => {
                        // Check if error message is a number (which would mean it's a status code)
                        const statusCode = parseInt(error.message, 10);
                        if (!isNaN(statusCode)) {
                            resolve({ status_code: statusCode });
                        } else {
                            reject(error);
                        }
                    })
            }
        })
    }
    serviceSetTasksByName = (task_name) => {
        return new Promise((resolve, reject) => {
            const authToken = UserService.getAuthToken();
            if (!authToken) {
                resolve({ status_code: 403 });
            }
            else {
                getTaskByNamesApi(authToken, task_name)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(res.status);
                        }
                        return res.json();
                    })
                    .then(data => {
                        resolve({ data, status_code: 200 });
                    })
                    .catch(error => {
                        // Check if error message is a number (which would mean it's a status code)
                        const statusCode = parseInt(error.message, 10);
                        if (!isNaN(statusCode)) {
                            resolve({ status_code: statusCode });
                        } else {
                            reject(error);
                        }
                    })
            }
        })
    }
    serviceHandleCreateTask = (user_id, task_data) => {
        return new Promise((resolve, reject) => {
            const authToken = UserService.getAuthToken();
            if (!authToken) {
                resolve({ status_code: 403 });
            }
            else {
                createNewTaskApi(user_id, task_data, authToken)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(res.status);
                        }
                        return res.json();
                    })
                    .then(data => {
                        resolve({ data, status_code: 200 });
                    })
                    .catch(error => {
                        // Check if error message is a number (which would mean it's a status code)
                        const statusCode = parseInt(error.message, 10);
                        if (!isNaN(statusCode)) {
                            resolve({ status_code: statusCode });
                        } else {
                            reject(error);
                        }
                    })
            }
        })
    }
    serviceHandleEditTask = (task_id, task_data) => {
        return new Promise((resolve, reject) => {
            const authToken = UserService.getAuthToken();
            if (!authToken) {
                resolve(403);
            }
            editTaskApi(task_id, task_data, authToken)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.status);
                    }
                    return res.json();
                })
                .then(data => {
                    resolve({ data, status_code: 200 });
                })
                .catch(error => {
                    // Check if error message is a number (which would mean it's a status code)
                    const statusCode = parseInt(error.message, 10);
                    if (!isNaN(statusCode)) {
                        resolve({ status_code: statusCode });
                    } else {
                        reject(error);
                    }
                })
        })
    }
    serviceHandleDeleteTask = (task_id) => {
        return new Promise((resolve, reject) => {
            const authToken = UserService.getAuthToken();
            if (!authToken) {
                resolve(403);
            }
            deleteTaskApi(task_id, authToken)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.status);
                    }
                    return res.json();
                })
                .then(data => {
                    resolve({ data, status_code: 200 });
                })
                .catch(error => {
                    // Check if error message is a number (which would mean it's a status code)
                    const statusCode = parseInt(error.message, 10);
                    if (!isNaN(statusCode)) {
                        resolve({ status_code: statusCode });
                    } else {
                        reject(error);
                    }
                })
        })
    }
}

export default TaskService.getInstance();

