// API Base URL
const API_URL = window.location.origin;

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    checkHealth();
    
    // Allow Enter key to add task
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Check health every 30 seconds
    setInterval(checkHealth, 30000);
});

// Check API health status
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        
        const statusElement = document.getElementById('healthStatus');
        statusElement.textContent = `✅ Server Healthy (Uptime: ${Math.floor(data.uptime)}s)`;
        statusElement.className = 'health-status healthy';
    } catch (error) {
        const statusElement = document.getElementById('healthStatus');
        statusElement.textContent = '❌ Server Offline';
        statusElement.className = 'health-status unhealthy';
    }
}

// Load all tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();
        
        renderTasks(tasks);
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks');
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id}, this.checked)"
            >
            <span class="task-title">${escapeHtml(task.title)}</span>
            <span class="task-date">${formatDate(task.createdAt)}</span>
            <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

// Add new task
async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    
    if (!title) {
        showError('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            input.value = '';
            loadTasks();
            showSuccess('Task added successfully!');
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showError('Failed to add task');
    }
}

// Toggle task completion
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            loadTasks();
            showSuccess(completed ? 'Task completed!' : 'Task reopened');
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Failed to update task');
        loadTasks(); // Reload to reset checkbox
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTasks();
            showSuccess('Task deleted successfully!');
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    }
}

// Update statistics
async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        const stats = await response.json();
        
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('pendingTasks').textContent = stats.pending;
        document.getElementById('completionRate').textContent = stats.completionRate + '%';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Utility Functions

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    console.log('✅', message);
}

function showError(message) {
    console.error('❌', message);
    alert(message);
}