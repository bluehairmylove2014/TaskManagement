import React, { memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Style
import '../../assets/styles/scss/_common_component.scss'

// Helpers
import { toggleClassNoListener, toggleClass } from '../../utils/helpers/ToggleClass';

// Redux
import { useDispatch } from 'react-redux';
import {
    deleteTask,
} from '../../redux/actions/tasks.action';

// Service
import TaskService from '../../services/TaskService';

const Task = ({ task, openEdit }) => {
    const moreOpDropdownRef = useRef(null);
    const reduxDispatch = useDispatch(); // This redux help delete task feature
    const navigate = useNavigate();
    const taskRef = useRef(null);


    const renderTag = (tags) => {
        const tag_react_element = tags.map((t, i) => {
            return (
                <div
                    className="cc-task__tag"
                    style={{ backgroundColor: t.background_color }}
                    key={`tag@${t.tag_name}-${i}`}
                    data-testid={`task-tag-${t.tag_name}`}
                >
                    <p>{t.tag_name}</p>
                </div>
            )
        })
        return (
            tag_react_element
        )
    }
    const handleDeleteTask = () => {
        // Call api to detele task on database
        const deleteTaskPromise = TaskService.serviceHandleDeleteTask(task.tid);

        toast.promise(
            deleteTaskPromise,
            {
                loading: 'Deleting task...',
                success: <b>Delete task successfully</b>,
                error: <b>Error delete task</b>,
            }
        );

        deleteTaskPromise
            .then(response => {
                if (response.status_code === 401 || response.status_code === 403) {
                    // Navigate to login
                    navigate('/login');
                } else {
                    // Delete task in state to update interface
                    reduxDispatch(deleteTask(task.tid));
                    return response;
                }
            })
            .catch(error => {
                // Handle error
            });
    }
    return (
        <>
            <div 
                className='common-component__task' 
                data-taskname={task.task_name} 
                data-status={task.status}
                data-priority={task.priority}
                ref={taskRef}
            >
                <div className="cc-task__tag-list">
                    {renderTag(task.tags)}
                </div>
                <h6 className='cc-task__title' data-testid={`task-title@${task.task_name}`}>{task.task_name}</h6>
                <p className='cc-task__description' data-testid='task-des'>{task.description}</p>
                <div className="cc-task__duedate" data-testid='task-duedate'>
                    <p>{task.due_date}</p>
                </div>
                <div className="cc-task__more-options-wrapper">
                    <div className="cc-task__more-options">
                        <button 
                            onClick={() => toggleClass(moreOpDropdownRef.current, 'active')} 
                            data-testid='showDropdown'
                        >
                            <i className="fi fi-br-menu-dots-vertical"></i>
                        </button>
                        <div className="cc-task__more-options-dropdown" ref={moreOpDropdownRef}>
                            <button data-id='editTask' onClick={() => {
                                openEdit(task);
                                toggleClassNoListener(moreOpDropdownRef.current, 'active');
                            }}>
                                <i className="fi fi-rs-magic-wand"></i>
                                <span>Edit task</span>
                            </button>
                            <button onClick={handleDeleteTask} data-id='deleteTask'>
                                <i className="fi fi-rr-trash"></i>
                                <span>Delete Task</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(Task);
