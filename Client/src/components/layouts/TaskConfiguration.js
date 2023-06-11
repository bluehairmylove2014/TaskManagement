import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
// Style
import '../../assets/styles/scss/_common_component.scss'

// subcomponent
import ButtonDropdown from '../common/ButtonDropdown';

// Helpers
import { toggleClassNoListener } from '../../utils/helpers/ToggleClass';
import { shortenDatetime, revertShortenedDatetime } from '../../utils/helpers/ShortenDatetime';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
    createNewTask, editTask,
} from '../../redux/actions/tasks.action';

// Service
import TaskService from '../../services/TaskService';

const TaskConfiguration = ({isShow, type, task_data}) => {
    const navigate = useNavigate();

    const TaskConfigurationRef = useRef(null);
    const createTagsRef = useRef(null);

    const reduxDispatch = useDispatch();
    const nof_tasks = useSelector(state => state.tasks.length);

    const [formCreateTask, setFormCreateTask] = useState(type === 'edit'? task_data : {
        status: '',
        tags: [],
        task_name: '',
        description: '',
        due_date: '',
        priority: ''
    });
    const [errorNotification, setErrorNotification] = useState('');

    // use effect
    useEffect(() => {
        toggleClassNoListener(TaskConfigurationRef.current, 'active');
    }, [isShow])

    // Methods
    const updateFormValue = useCallback((key, value) => {
        // Function to update a specific form value
        setFormCreateTask(prevValues => ({
        ...prevValues,
        [key]: value
        }));
    });
    const isRequireInputFilled = () => {
        if (!formCreateTask.task_name) {
            setErrorNotification('Please choose task name!');
            return false;
        }
        else if(!formCreateTask.status) {
            setErrorNotification('Please choose task status!');
            return false;
        } 
        else {
            setErrorNotification('');
            return true;
        }
    }
    const handleCreateNewTask = (e) => {
        // Prevent browser defalut reload page when submit
        e.preventDefault();

        // Check if required input is filled?
        if(!isRequireInputFilled()) {
            return;
        }
        
        // Get form ref
        const formResult = e.target;

        // Create new task val with from value
        const newTask = {
            id: type === 'new' ? `task@${nof_tasks + 1}` : formCreateTask.id ,
            status: formCreateTask.status,
            tags: formCreateTask.tags,
            task_name: formCreateTask.task_name,
            description: formCreateTask.description,
            due_date: formCreateTask.due_date ? formCreateTask.due_date : 'Unlimited',
            priority: formCreateTask.priority
        }
        if(type === 'new') {
            // If put task to bottom, push back new task
            // Else push head new task
            reduxDispatch(createNewTask(newTask, formResult.location[0].checked ? 'bottom' : 'top'));

            // Update in database
            TaskService.serviceHandleCreateTask(1, newTask)
                .then(response => {
                    if(response.status_code === 401 || response.status_code === 403) {
                        // Navigate to login
                        navigate('/login')
                    }
                    else {
                        return response;
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
        else {
            // Update in state to update interface 
            reduxDispatch(editTask(newTask))

            // Update in database
            TaskService.serviceHandleEditTask(newTask.id, newTask)
                .then(response => {
                    if(response.status_code === 401 || response.status_code === 403) {
                        // Navigate to login
                        navigate('/login')
                    }
                    else {
                        return response;
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

        // Hide create layout
        TaskConfigurationRef.current.classList.remove('active');
    }
    const handleChangeTagname = (e) => {
        const addTagBtn = createTagsRef.current.querySelector('button');
        
        if(addTagBtn) {
            if(e.target.value.length === 0) {
                addTagBtn.classList.remove('active');
            }
            else {
                if(!addTagBtn.classList.contains('active')) {
                    addTagBtn.classList.add('active');
                }
            }
        }
        else {
            console.log('Cannot find add tag button')
        }
    }
    const handleDeleteTempTag = (tag_index) => {
        const tagListCopy = [...formCreateTask.tags];
        tagListCopy.splice(tag_index, 1);
        updateFormValue('tags', tagListCopy);
    }
    const renderTag = (tags) => {
        const tag_react_element = tags.map((t, i) => {
            return (
                <div 
                    className="cc-task__tag" 
                    style={{backgroundColor: t.background_color} }
                    key={`tag@${t.tag_name, i}`}
                >
                    <p>{t.tag_name}</p>
                    <button type='button' onClick={() => handleDeleteTempTag(i)}>x</button>
                </div>
            )
        })
        return (
            tag_react_element
        )
    }
    const createTempTags = () => {
        const addTagBtn = createTagsRef.current.querySelector('button');
        const inputs = createTagsRef.current.getElementsByTagName('input');
        const tagName = inputs[0].value;
        const tagColor = inputs[1].value;
    
        // Use the tagName and tagColor variables to create a tag
        updateFormValue('tags', [...formCreateTask.tags, {
            tag_name: tagName,
            background_color: tagColor
        }])
        
        // Reset the input values
        inputs[0].value = '';
        inputs[1].value = '';

        // Undisplay create button
        toggleClassNoListener(addTagBtn, 'active');
    }

    return (
        <div className="common-component__tasks-configuration" ref={TaskConfigurationRef}>
            {type === 'new' && <h3>CREATE NEW TASK</h3>}
            {type === 'edit' && <h3>EDIT TASK</h3>}
            {/* Form create new task, high process */}
            <form className="tasks__create-container" onSubmit={handleCreateNewTask}>
                <div className="tasks-create__main-information">
                    <input
                        type="text"
                        placeholder='Task name...'
                        className='tasks-create__task-name'
                        name='task_name'
                        defaultValue={formCreateTask.task_name}
                        onChange={(e) => updateFormValue('task_name', e.target.value)}
                    />
                    <div className="tasks-create-main__tags">
                        {renderTag(formCreateTask.tags)}
                        <button
                            type='button'
                            onClick={(e) => {
                                e.target.style.display = 'none';
                                toggleClassNoListener(createTagsRef.current, 'active');
                            }}

                        >
                            Add tag +
                        </button>
                        <div className="task-create-main__new-tag" ref={createTagsRef}>
                            <input
                                type="text"
                                placeholder='Tag name'
                                name='tag_name'
                                onChange={handleChangeTagname}
                            />
                            <input type="color" name='tag_color' />
                            <button type='button' onClick={createTempTags}>
                                <i className="fi fi-ss-check-circle"></i>
                            </button>
                        </div>
                    </div>
                    <textarea
                        type="text"
                        placeholder='You can add descriptive text to help yourself or other better understand this user history'
                        className='tasks-create__task-des'
                        name='task_des'
                        defaultValue={formCreateTask.description}
                        onChange={(e) => updateFormValue('description', e.target.value)}
                    />
                </div>
                <div className="task-create__sub-information">
                    <ButtonDropdown
                        placeHolder={'Choose Status'}
                        icon={'fi fi-rs-angle-small-down'}
                        selectVal={[
                            'Backlog',
                            'To Do',
                            'Process',
                            'Done'
                        ]}
                        callbackKey={'status'}
                        callback={updateFormValue}
                        defaultValue={formCreateTask.status}
                    />
                    <label htmlFor="choose-location">Location</label>
                    <div className="task-create__choose-location" id='choose-location'>
                        <input type="radio" id='choose-location__bottom' name='location' defaultChecked />
                        <label htmlFor="choose-location__bottom">At the bottom</label>
                        <input type="radio" id='choose-location__top' name='location' />
                        <label htmlFor="choose-location__top">At the top</label>
                    </div>
                    <button 
                        className="task-create__choose-duedate" 
                        type='button' 
                        onClick={e => e.target.childNodes[1].showPicker()}
                    >
                        <label htmlFor="choose-duedate">Due Date: </label>
                        <input
                            type="datetime-local"
                            name="duedate"
                            id='choose-duedate'
                            defaultValue={revertShortenedDatetime(formCreateTask.due_date)}
                            onChange={(e) => updateFormValue('due_date', shortenDatetime(e.target.value))}
                        />
                    </button>
                    <ButtonDropdown
                        placeHolder={'Choose Priority'}
                        selectVal={[
                            'Negligible',
                            'Minor',
                            'Moderate',
                            'Significant',
                            'Critical'
                        ]}
                        callbackKey={'priority'}
                        callback={updateFormValue}
                        defaultValue={formCreateTask.priority}
                    />
                </div>
                <button type='submit' className='task-create__submit-btn'>
                    {type === 'edit' ? 'COMMIT CHANGE' : 'CREATE'}
                </button>
                <div className={`tasks-create__error-notification ${errorNotification && 'active'}`}>
                    <p><b>{errorNotification}</b></p>
                </div>
            </form>
            <button
                className='tasks__close-btn'
                onClick={() => {
                    toggleClassNoListener(TaskConfigurationRef.current, 'active')
                }}
            >
                <i className="fi fi-bs-cross-circle"></i>
            </button>
        </div>
    );
}

export default memo(TaskConfiguration);
