// dependencies
import '../styles/style.css';
import 'iconify-icon';

// import interfaces
import { Todo } from './interfaces';

const taskForm = document.querySelector<HTMLFormElement>('#task-form');
const taskInput = document.querySelector<HTMLInputElement>('#task-input');
const todoList = document.querySelector<HTMLUListElement>('#todo-list');
const filterBtns = document.querySelectorAll('.filter-btns > .filter-btn');
const clearAllBtn = document.querySelector('#clear-all-btn');
const STORAGE_KEY = 'todo-list';

let todos: Todo[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let editId: number;
let isEditedTask: boolean = false;

if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleTaskSubmission();
    });
}

if (taskInput) {
    taskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleTaskSubmission();
        }
    });
}

function handleTaskSubmission() {
    const taskInputTarget = taskInput as HTMLInputElement;
    const taskValue = taskInputTarget.value.trim();
    if (!taskValue) return;

    if (!isEditedTask) {
        const taskInfo: Todo = {
            name: taskValue,
            status: 'pending',
        };
        todos.push(taskInfo);
    } else {
        todos[editId].name = taskValue;
        isEditedTask = false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    taskInputTarget.value = '';
    handleShowTodos();
}

function handleShowTodos(filter: string = 'all') {
    if (!todoList) return;

    todoList.innerHTML = '';

    const filteredTodos = todos.filter((todo) => filter === 'all' || todo.status === filter);

    if (filteredTodos.length === 0) {
        const liTag = document.createElement('li');
        liTag.className = 'flex items-center justify-center p-3 bg-gray-50 rounded border border-gray-200';
        liTag.innerHTML = `<span class="text-gray-500">No Todos found</span>`;
        todoList.appendChild(liTag);
        return;
    }

    filteredTodos.forEach((todo, id) => {
        const isTaskCompleted = todo.status === 'completed';
        const liTag = document.createElement('li');
        liTag.className = 'flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200';
        liTag.innerHTML = `
          <div class="flex items-center">
            <input type="checkbox" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded task-checkbox" id="task-${id}" ${isTaskCompleted ? 'checked' : ''}>
            <label class="ml-3 text-gray-800 cursor-pointer ${isTaskCompleted ? 'line-through' : ''}" for="task-${id}">${todo.name}</label>
          </div>
          <div class="flex space-x-2">
            <button class="text-blue-600 hover:text-blue-800" id="task-edit-btn">
              <iconify-icon icon="mdi:pencil" width="20" height="20"></iconify-icon>
            </button>
            <button class="text-red-600 hover:text-red-800" id="task-delete-btn">
              <iconify-icon icon="mdi:delete" width="20" height="20"></iconify-icon>
            </button>
          </div>
        `;

        const checkInput = liTag.querySelector<HTMLInputElement>('.task-checkbox');
        if (checkInput) {
            checkInput.addEventListener('change', (e) => handleUpdateStatus(e, todos.indexOf(todo)));
        }

        const deleteBtn = liTag.querySelector<HTMLButtonElement>('#task-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleDeleteTask(todos.indexOf(todo)));
        }

        const editBtn = liTag.querySelector<HTMLInputElement>('#task-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => handleEditTask(todos.indexOf(todo), todo.name));
        }

        todoList.appendChild(liTag);
    });
}

function handleUpdateStatus(e: Event, id: number) {
    const selectedInput = e.target as HTMLInputElement;
    const taskNameTag = selectedInput.nextElementSibling;

    if (selectedInput.checked) {
        taskNameTag?.classList.add('line-through');
        todos[id].status = 'completed';
    } else {
        taskNameTag?.classList.remove('line-through');
        todos[id].status = 'pending';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function handleEditTask(id: number, taskName: string) {
    editId = id;
    isEditedTask = true;
    if (taskInput) taskInput.value = taskName;
}

function handleDeleteTask(deleteId: number) {
    todos.splice(deleteId, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    handleShowTodos();
}

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelector('.btn-active')?.classList.remove('btn-active');
        btn.classList.add('btn-active');
        handleShowTodos(btn.id);
    });
});

if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
        const isConfirmed = confirm('Are you sure you want to delete all todos?');
        if (isConfirmed) {
            todos = [];
            localStorage.removeItem(STORAGE_KEY);
            handleShowTodos('all');
        }
    });
}

handleShowTodos('all');
