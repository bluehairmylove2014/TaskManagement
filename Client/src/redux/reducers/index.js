
import tasks from "./tasks.reducer";
import { combineReducers } from "redux";

const allReducers = combineReducers ({
    tasks
})

export default allReducers;