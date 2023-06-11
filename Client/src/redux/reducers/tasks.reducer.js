let tasks = [];

const taskReducer = (state = tasks, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return action.payload;
        case 'CREATE_TASK_TOP':
            return [action.payload, ...state];
        case 'CREATE_TASK_BOTTOM':
            return [...state, action.payload];
        case 'EDIT_TASK':
            return state.map(t => {
                (t.id === action.payload.id) && (t = {...action.payload})
                return t;
            })
        case 'DELETE_TASK':
            return state.filter(t => t.id !== action.payload)

        default:
            return state;
    }
}
export default taskReducer;