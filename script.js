// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/todos';

// DOM Elements
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const priorityInput = document.getElementById('priority-input');
const dueDateInput = document.getElementById('due-date-input');
const todoList = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const filterCompleted = document.getElementById('filter-completed');
const filterPriority = document.getElementById('filter-priority');
const searchInput = document.getElementById('search-input');

// State
let todos = [];
let currentFilter = { completed: 'all', priority: 'all', search: '' };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    form.addEventListener('submit', handleAddTodo);
    filterCompleted.addEventListener('change', handleFilterChange);
    filterPriority.addEventListener('change', handleFilterChange);
    searchInput.addEventListener('input', handleSearch);
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        loading.style.display = 'block';
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert('Error: ' + error.message);
        return null;
    } finally {
        loading.style.display = 'none';
    }
}

// Load Todos
async function loadTodos() {
    const params = new URLSearchParams();
    
    if (currentFilter.completed !== 'all') {
        params.append('completed', currentFilter.completed);
    }
    
    if (currentFilter.priority !== 'all') {
        params.append('priority', currentFilter.priority);
    }
    
    if (currentFilter.search) {
        params.append('search', currentFilter.search);
    }
    
    const url = `${API_BASE_URL}?${params.toString()}`;
    const result = await apiRequest(url);
    
    if (result && result.success) {
        todos = result.data;
        renderTodos();
    }
}

// Add Todo
async function handleAddTodo(e) {
    e.preventDefault();
    
    const task = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;
    
    if (!task) {
        alert('Please enter a task title');
        return;
    }
    
    const todoData = {
        title: task,
        description: description || undefined,
        priority: priority,
        dueDate: dueDate || undefined
    };
    
    const result = await apiRequest(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(todoData)
    });
    
    if (result && result.success) {
        form.reset();
        loadTodos();
    }
}

// Update Todo
async function updateTodo(id, updates) {
    const result = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    
    if (result && result.success) {
        loadTodos();
    }
}

// Delete Todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const result = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    
    if (result && result.success) {
        loadTodos();
    }
}

// Toggle Complete
async function toggleComplete(id, completed) {
    await updateTodo(id, { completed: !completed });
}

// Render Todos
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li>No tasks found</li>';
        return;
    }
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '';
        const priorityClass = `priority-${todo.priority}`;
        
        li.innerHTML = `
            <div class="todo-content">
                <h3>${todo.title}</h3>
                ${todo.description ? `<p>${todo.description}</p>` : ''}
                <div class="todo-meta">
                    <span class="priority ${priorityClass}">${todo.priority}</span>
                    ${dueDate ? `<span class="due-date">Due: ${dueDate}</span>` : ''}
                </div>
            </div>
            <div class="todo-actions">
                <button class="complete-btn" onclick="toggleComplete('${todo._id}', ${todo.completed})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTodo('${todo._id}')">Delete</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

// Filter and Search
function handleFilterChange() {
    currentFilter.completed = filterCompleted.value;
    currentFilter.priority = filterPriority.value;
    loadTodos();
}

function handleSearch() {
    currentFilter.search = searchInput.value;
    loadTodos();
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

function getPriorityClass(priority) {
    return `priority-${priority}`;
}
