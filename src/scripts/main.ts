// dependencies
import '../styles/style.css';
import 'iconify-icon';

// import interfaces
import { Todo } from './interfaces';

const taskForm = document.querySelector<HTMLFormElement>('#task-form');
const taskInput = document.querySelector<HTMLInputElement>('#task-input');
const todoList = document.querySelector<HTMLUListElement>('#todo-list');
const STORAGE_KEY = 'todo-list';

let todos: Todo[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

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
    const taskInfo: Todo = {
        name: taskValue,
        status: 'pending',
    };
    todos.push(taskInfo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    taskInputTarget.value = '';
    handleShowTodos();
}

function handleShowTodos() {
    if (!todoList) return;
    todoList.innerHTML = '';
    todos.forEach((todo, id) => {
        const isTaskCompleted = todo.status === 'completed';
        const liTag = document.createElement('li');
        liTag.className = 'flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200';
        liTag.innerHTML = `
          <div class="flex items-center">
            <input type="checkbox" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded task-checkbox" id="task-${id}" ${isTaskCompleted && 'checked'} >
            <label class="ml-3 text-gray-800 cursor-pointer ${isTaskCompleted && 'line-through'} " for="task-${id}">${todo.name}</label>
          </div>
          <div class="flex space-x-2">
            <button class="text-blue-600 hover:text-blue-800">
              <iconify-icon icon="mdi:pencil" width="20" height="20"></iconify-icon>
            </button>
            <button class="text-red-600 hover:text-red-800" id="task-delete-btn">
              <iconify-icon icon="mdi:delete" width="20" height="20"></iconify-icon>
            </button>
          </div>
        `;
        const checkInput = liTag.querySelector<HTMLInputElement>('.task-checkbox');
        if (checkInput) {
            checkInput.addEventListener('change', (e) => handleUpdateStatus(e, id));
        }

        const deleteBtn = liTag.querySelector<HTMLButtonElement>('#task-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleDeleteTask(id));
        }

        todoList?.appendChild(liTag);
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

function handleDeleteTask(deleteId: number) {
    todos.splice(deleteId, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    handleShowTodos();
}

handleShowTodos();
