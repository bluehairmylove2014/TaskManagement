import React, { memo, useState } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import {
    setTasks
} from '../../redux/actions/tasks.action';

const FilterBoard = ({isShow, callback}) => {
    // Define
    const [filterForm, setFilterForm] = useState({
        priority: 'Indifferent',
        status: 'Indifferent',
        due_date_start: null,
        due_date_end: null
    })
    const task_list = useSelector(state => state.tasks);
    const [taskBackup, setTaskBackup] = useState(null);
    const dispatch = useDispatch();

    // Methods
    const updateFormValue = (key, value) => {
        // Function to update a specific form value
        setFilterForm(prevValues => ({
            ...prevValues,
            [key]: value
        }));
    };

    const handleFilter = (e) => {
        // Stop reload page when submit
        e.preventDefault();

        // Define
        let tasks = null;

        // If user used filter before, do not backup task 
        // and update task_list
        if(!taskBackup) {
            // backup
            setTaskBackup(task_list);
            tasks = [...task_list];
        }
        else {
            // update state
            tasks = [...taskBackup];
        }

        if(filterForm.priority && filterForm.priority !== 'Indifferent') {
            // Filter by priority
            tasks = tasks.filter(t => t.priority === filterForm.priority)
        }
        if(filterForm.status && filterForm.status !== 'Indifferent') {
            // Filter by status
            tasks = tasks.filter(t => t.status === filterForm.status)
        }
        if(filterForm.due_date_start || filterForm.due_date_end) {
            // Filter by due date
            const start = new Date(filterForm.due_date_start ? filterForm.due_date_start : -8640000000000000);
            const end = new Date(filterForm.due_date_end ? filterForm.due_date_end : 8640000000000000);
            
            if(start < end) {
                tasks = tasks.filter(t => {
                    const targetDate = new Date(t.due_date);

                    if(targetDate) {
                        if(start < targetDate && targetDate < end) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return true;
                    }
                })
            }
            else {
                // Show notification
            }
        }

        // Commit change
        dispatch(setTasks(tasks));
    }

    return (
        <div className={`common-component__filter-board ${isShow && 'active'}`}>
            <button className="cc-filter__close-btn" onClick={() => callback(false)}>
                <i className="fi fi-rr-arrow-small-left"></i>
            </button>
            <div className="cc-filter__header">
                <h6>Your tasks, your options!</h6>
            </div>
            <form className='cc-filter__form' onSubmit={handleFilter}>
                {/* Priority filter */}
                <label htmlFor="priority-filter">Priority</label>
                <select 
                    name="priority-select" 
                    id="priority-filter" 
                    onChange={(e) => updateFormValue('priority', e.target.value)}
                    defaultValue={filterForm.priority}
                >
                    <option value="Indifferent">Indifferent</option>
                    <option value="Negligible">Negligible</option>
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Significant">Significant</option>
                    <option value="Critical">Critical</option>
                </select>

                {/* Status filter */}
                <label htmlFor="status-filter">Status</label>
                <select 
                    name="status-select" 
                    id="status-filter"
                    onChange={(e) => updateFormValue('status', e.target.value)}
                    defaultValue={filterForm.status}
                >
                    <option value="Indifferent">Indifferent</option>
                    <option value="Backlog">Backlog</option>
                    <option value="To Do">To Do</option>
                    <option value="Process">Process</option>
                    <option value="Done">Done</option>
                </select>

                {/* Due date filter */}
                <p>Due Date</p>
                <div className="cc-filter__duedate-picker">
                    <div className="cc-filter-duedate-picker__wrapper">
                        {/* Due date filter - start input */}
                        <label htmlFor="start-date-filter">From</label>
                        <input 
                            type="datetime-local" 
                            id='start-date-filter'
                            onChange={e => updateFormValue('due_date_start', e.target.value)}
                        />
                    </div>
                    <div className="cc-filter-duedate-picker__wrapper">
                        {/* Due date filter - end input */}
                        <label htmlFor="end-date-filter">To</label>
                        <input 
                            type="datetime-local" 
                            id='end-date-filter'
                            onChange={e => updateFormValue('due_date_end', e.target.value)}
                        />
                    </div>
                </div>

                {/* Button field */}
                <div className="cc-filter__interact-container">
                    <button type='button' onClick={() => dispatch(setTasks(taskBackup ? taskBackup : task_list))}>
                        <i className="fi fi-rs-trash"></i>
                        <span>Clear</span>
                    </button>
                    <button type='submit'>
                        Apply
                    </button>
                </div>
            </form>
        </div>
    );
}

export default memo(FilterBoard);
