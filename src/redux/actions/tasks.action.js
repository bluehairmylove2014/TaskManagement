export const setTasks = (tasks) => {
    return ({
        type: 'SET_TASKS',
        payload: tasks
    })
}
export const createNewTask = (taskData, location) => {
    return ({
        type: (location === 'top' ? 'CREATE_TASK_TOP' : 'CREATE_TASK_BOTTOM'),
        payload: taskData
    })
}
export const editTask = (taskData) => {
    return ({
        type: 'EDIT_TASK',
        payload: taskData
    })
}
export const deleteTask = (taskID) => {
    return ({
        type: 'DELETE_TASK',
        payload: taskID
    })
}