document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            taskContent.innerHTML = `
                <strong>${task.text}</strong>
                <br>
                <small>${new Date(task.date).toLocaleString()}</small>
            `;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.addEventListener('click', () => toggleComplete(index));

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskActions.appendChild(completeBtn);
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);

            li.appendChild(taskContent);
            li.appendChild(taskActions);
            taskList.appendChild(li);
        });
    }

    function addTask(text, date) {
        tasks.push({ text, date, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const li = taskList.children[index];
        const taskContent = li.querySelector('.task-content');
        const currentText = tasks[index].text;
        const currentDate = tasks[index].date;

        const editForm = document.createElement('form');
        editForm.className = 'edit-form';
        editForm.innerHTML = `
            <input type="text" value="${currentText}" required>
            <input type="datetime-local" value="${currentDate}" required>
            <button type="submit">Save</button>
        `;

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newText = editForm.elements[0].value;
            const newDate = editForm.elements[1].value;
            tasks[index].text = newText;
            tasks[index].date = newDate;
            saveTasks();
            renderTasks();
        });

        taskContent.replaceWith(editForm);
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const date = taskDate.value;
        if (text && date) {
            addTask(text, date);
            taskInput.value = '';
            taskDate.value = '';
        }
    });

    renderTasks();
});