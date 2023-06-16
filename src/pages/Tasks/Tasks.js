
import React, {useCallback, useEffect, useState } from 'react';
import '../../assets/styles/scss/_tasks.scss';
import toast, { Toaster } from 'react-hot-toast';

// subcomponent
import Task from '../../components/common/Task';
import TaskConfiguration from '../../components/layouts/TaskConfiguration';
import FilterBoard from '../../components/layouts/FilterBoard';

// svg icons
import TaskSVGIcons from '../../assets/images/icons/task.svg';

// Service
import TaskService from '../../services/TaskService';

// Helper
import {
    toggleClass,
} from '../../utils/helpers/ToggleClass';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../../redux/actions/tasks.action';

// Debounce support lib
import { debounce } from 'lodash';

const Tasks = () => {
    // Define
    const tasks = useSelector(state => state.tasks);
    const [isConfigTaskActive, setIsConfigTaskActive] = useState(false);
    const [configTaskType, setConfigTaskType] = useState('new');
    const [defaultTaskData, setDefaultTaskData] = useState([]);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const reduxDispatch = useDispatch();

    // use effect
    useEffect(() => {
        TaskService.serviceHandleGetAllTasks()
            .then(response => {
                if(response.status_code === 401 || response.status_code === 403) {
                    // to do
                }
                else {
                    reduxDispatch(setTasks(response.data));
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, [reduxDispatch]);

    // Methods
    /**
     * Support {
     *      task_name: string
     * }
     */
    const fetchTasksDataByName = debounce((name) => {
        TaskService.serviceSetTasksByName(name)
            .then(response => {
                if(response.status_code === 401 || response.status_code === 403) {
                    // to do
                }
                else {
                    console.log(response.data)
                    reduxDispatch(setTasks(response.data));
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, 500);

    const showSortOptions = (e) => {
        const optionDropdown = e.target.parentNode.querySelector('.tasks-main-list-header__sort-dropdown');
        optionDropdown && toggleClass(optionDropdown, 'active');
    }

    const handleSort = (criteria, status) => {
        let result = [];
        if(criteria && criteria === 'priority') {
            result = tasks.filter(t => t.status !== status);
            tasks.slice().reverse().forEach(t => {
                (t.status === status) && result.push(t);
            })
            reduxDispatch(setTasks(result));
        }
        else if(criteria && criteria === 'revert') {
            result = tasks.filter(t => t.status !== status);
            tasks.slice().reverse().forEach(t => {
                t.status === status && result.push(t);
            })
            reduxDispatch(setTasks(result));
        }
        else {
            console.log('wrong sort criteria')
        }
    }

    const renderTaskList = (task_list_name, task_status, task_list_data) => {
        // Check if data is valid
        if(!Array.isArray(task_list_data)) {
            return <></>;
        }
        // Find the task have the same status
        const taskResult = task_list_data.filter(t => task_status === t.status);
        // Return an array of react_element which is a task
        return (
            <div className="tasks-main__list" key={task_status}>
                <div className="tasks-main-list__header">
                    <h2>{task_list_name}</h2>
                    <div className="tasks-main-list-header__interact-container">
                        <div className="tasks-main-list-header__sort-container">
                            <button onClick={showSortOptions}>
                                <i className="fi fi-br-sort-alpha-down"></i>
                            </button>
                            <div className="tasks-main-list-header__sort-dropdown">
                                <button onClick={() => handleSort('priority', task_status)}>
                                    <i className="fi fi-rr-star"></i>
                                    <span>Sort by priority</span>
                                </button>
                                <button onClick={() => handleSort('revert', task_status)}>
                                    <i className="fi fi-rr-arrow-up-square-triangle"></i>
                                    <span>Revert sort</span>
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => openCreateTask()} 
                            id={task_status}
                            data-testid={`createTask-btn-${task_list_name}`}
                        >
                            <i className="fi fi-br-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="tasks-main-list__content">
                    {
                        taskResult.map(t => {
                            return <Task 
                                task={t} 
                                key={t.id} 
                                openEdit={openEditTask}
                            />
                        })
                    }
                </div>
            </div>
        )
    }

    const openEditTask = useCallback((task_data) => {
        setDefaultTaskData(task_data);
        setConfigTaskType('edit');
        setIsConfigTaskActive(true);
    })
    const openCreateTask = () => {
        setDefaultTaskData({});
        setConfigTaskType('new');
        setIsConfigTaskActive(true);
    }
    const closeEditTask = useCallback(() => {
        setConfigTaskType('new');
        setDefaultTaskData({});
        setIsConfigTaskActive(false);
    })

    return (
        <main className='tasks'>
            <div className="tasks__header">
                <div className="tasks-header__title">
                    <img src={TaskSVGIcons} className='tasks-header__title-icon' alt="" />
                    <h1>Tasks</h1>
                </div>
                
                <div className="tasks__interact-field">
                    <button className='tasks__filter-btn' onClick={() => setIsFilterActive(!isFilterActive)}>
                        <i className="fi fi-br-settings-sliders"></i>
                        <span>Filter</span>
                    </button>
                    <div className="tasks__search-box">
                        <input type="text" placeholder='Search anything...' onChange={(e) => fetchTasksDataByName(e.target.value)}/>
                        <button type='button'>
                            <i className="fi fi-rr-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="tasks__main">
                {/* Rnder 4 task lists vertically */}
                {renderTaskList('Backlog', 'Backlog', tasks)}
                {renderTaskList('To Do', 'To Do', tasks)}
                {renderTaskList('Process', 'Process', tasks)}
                {renderTaskList('Done', 'Done', tasks)}
            </div>
            <TaskConfiguration 
                isShow={isConfigTaskActive} 
                type={configTaskType}
                task_data={defaultTaskData}
                closeEdit={closeEditTask}
            />
            <FilterBoard isShow={isFilterActive} callback={setIsFilterActive}/>
        </main>
    );
}

export default Tasks;


