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
    let li = '';

    todos.forEach((todo, id) => {
        li += ` <li class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div class="flex items-center">
            <input type="checkbox" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded" id="task-${id}">
            <label class="ml-3 text-gray-800 cursor-pointer" for="task-${id}">${todo.name}</label>
          </div>
          <div class="flex space-x-2">
            <button class="text-blue-600 hover:text-blue-800">
              <iconify-icon icon="mdi:pencil" width="20" height="20"></iconify-icon>
            </button>
            <button class="text-red-600 hover:text-red-800">
              <iconify-icon icon="mdi:delete" width="20" height="20"></iconify-icon>
            </button>
          </div>
        </li>`;
    });

    if (todoList) {
        todoList.innerHTML = li;
    }
}

handleShowTodos();
