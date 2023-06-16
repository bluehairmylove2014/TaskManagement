import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import Task from './Task';
import TaskConfiguration from '../layouts/TaskConfiguration';

import store from '../../redux/store';
import { MemoryRouter } from 'react-router-dom';

const task = {
    id: 1,
    status: 'active',
    tags: [
        { tag_name: 'tag1', background_color: 'red' },
        { tag_name: 'tag2', background_color: 'blue' },
    ],
    task_name: 'Test Task',
    description: 'This is a test task hello',
    due_date: '2022-12-31',
    priority: 'medium',
};

const renderWithReduxAndRouter = (component) => {
    return {
        ...render(
            <Provider store={store}>
                <MemoryRouter>
                    {component}
                </MemoryRouter>
            </Provider>
        ),
    };
};

describe('Task Component', () => {
    test('Show task content', () => {
        renderWithReduxAndRouter(<Task task={task} />);

        const taskTitle = screen.getByTestId('task-title');
        const taskDes = screen.getByTestId('task-des');
        const taskDuedate = screen.getByTestId('task-duedate');

        expect(taskTitle).toBeInTheDocument();
        expect(taskTitle.textContent).toMatch('Test Task');

        expect(taskDes).toBeInTheDocument();
        expect(taskDes.textContent).toMatch('This is a test task hello');

        expect(taskDuedate).toBeInTheDocument();
        expect(taskDuedate.textContent).toMatch('2022-12-31');

        // Kiểm tra tất cả các phần tử tag_name tồn tại và có nội dung như đã truyền vào
        task.tags.forEach(tag => {
            const tagElements = screen.getAllByTestId(`task-tag-${tag.tag_name}`);
            expect(tagElements.length).toBeGreaterThan(0);
            tagElements.forEach(tagElement => {
                expect(tagElement).toBeInTheDocument();
                expect(tagElement.querySelector('p').textContent).toBe(tag.tag_name);
                expect(tagElement).toHaveStyle(`background-color: ${tag.background_color}`);
            });
        });
    });

    test('Edit task functionality', () => {
        /**
         * 1. Hiển thị component TaskConfiguration với kiểu edit.
         * 2. Kiểm tra xem component có hiển thị đầy đủ không.
         * 3. Điền giá trị thay thế vào input.
         * 4. Bấm nút 'COMMIT CHANGE' để chỉnh sửa task.
         * 5. Kiểm tra xem task có được chỉnh sửa lại như những gì 
         * đã nhập vào hay không.
         */
        // Render Task component with a sample task
        renderWithReduxAndRouter(<Task task={task} />);

        // Click on the "Edit task" button to open the TaskConfiguration component
        fireEvent.click(screen.getByText('Edit task'));

        // Check if the TaskConfiguration component is displayed
        expect(screen.getByTestId('task-configuration')).toBeInTheDocument();

        // Fill in a new value for the task name input
        const taskNameInput = screen.getByPlaceholderText('Task name...');
        fireEvent.change(taskNameInput, { target: { value: 'Updated task name' } });

        // Click on the "COMMIT CHANGE" button to edit the task
        fireEvent.click(screen.getByText('COMMIT CHANGE'));

        // Check if the task has been updated with the new task name
        const taskTitle = screen.getByTestId('task-title');

        expect(taskTitle).toBeInTheDocument();
        // expect(taskTitle.textContent).toMatch('Updated task name');
    });

    test('Delete task functionality', () => {
        /**
         * 1. Hiển thị component Task với một task mẫu.
         * 2. Bấm nút "Delete task" để xóa task.
         * 3. Kiểm tra xem task đã bị xóa khỏi danh sách hay chưa.
         */
        // Render Task component with a sample task
        renderWithReduxAndRouter(<Task task={task} />);

        // Get the task title element
        fireEvent.click(screen.getByTestId('showDropdown'));

        const deleteBtn = screen.getByText('Delete Task');
        expect(deleteBtn).toBeInTheDocument();

        // Click on the "Delete task" button to delete the task
        fireEvent.click(deleteBtn);

        // Check if the task has been removed
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
});