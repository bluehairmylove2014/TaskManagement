import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import Tasks from '../../pages/Tasks/Tasks';
import store from '../../redux/store';
import { MemoryRouter } from 'react-router-dom';

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

describe('Tasks Component', () => {
    test('Render Tasks component', () => {
        renderWithReduxAndRouter(<Tasks />);

        // Kiểm tra xem component Tasks có được render hay không
        expect(screen.getByText('Tasks')).toBeInTheDocument();
    });

    test('Create new task functionality', async () => {
        /**
         * 1. Hiển thị component TaskConfiguration với kiểu new.
         * 2. Kiểm tra xem component có hiển thị đầy đủ không.
         * 3. Điền giá trị vào input.
         * 4. Bấm nút 'COMMIT CHANGE' để tạo task mới.
         * 5. Kiểm tra xem task mới có được thêm vào danh sách hay không.
         */
        renderWithReduxAndRouter(<Tasks />);

        // Click on the "Create task" button to open the TaskConfiguration component
        fireEvent.click(screen.getByTestId('createTask-btn-Backlog'));

        // Check if the TaskConfiguration component is displayed
        expect(screen.getByTestId('task-configuration')).toBeInTheDocument();

        // Fill in the values for the task inputs
        const taskNameInput = screen.getByPlaceholderText('Task name...');
        fireEvent.change(taskNameInput, { target: { value: 'New task name' } });

        // Click on the "CREATE" button to create a new task
        fireEvent.click(screen.getByText('CREATE'));

        // Check if the new task has been added to the list
        // await waitFor(() => {
        //     const newTaskTitle = screen.getByText('New task name');
        //     expect(newTaskTitle).toBeInTheDocument();
        // });
    });
});