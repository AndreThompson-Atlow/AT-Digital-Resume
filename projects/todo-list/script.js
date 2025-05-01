document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const filterSelect = document.getElementById('filter-select');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const totalTasksEl = document.getElementById('total-tasks');
    const activeTasksEl = document.getElementById('active-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editInput = document.getElementById('edit-input');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const timeDisplay = document.getElementById('current-time');
    
    // Variables
    let tasks = [];
    let currentFilter = 'all';
    let editingTaskId = null;
    
    // Sounds
    const addSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAAGwuTR2lgAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAGwAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADEDsQAAAAAAAAGw3JQy3wAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAALyAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAAL6AAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    
    const completeSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeAANjY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDIAAAAAAAAAHgQJR7eAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAHgADY2NjY2NjY2NjY2NjY2Nk1NTU1NTU1NTU1NTU1NTWpqampqampqampqampqav//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADUEAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAALqAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAAQwAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxKQJQAaoCWAIAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    
    const deleteSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAABLAAICAgICAgICAgICAgQEBAQEBAQEBAQEBAQGBgYGBgYGBgYGBgYGBggICAgICAgICAgICAgID//////////////////wAAAABMYXZjNTguMTMAAAAAAAAAAAAAADEEkAAAAAAAAASwDxlFhQAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAQAAASQACAgICAgICAgICAgIEBAQEBAQEBAQEBAQEBgYGBgYGBgYGBgYGBgYICAgICAgICAgICAgICA//////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAA2BVAAAAAAAAAEsCXUEBAAAAAAAAAAAAAAAAAAAP/jGMQAAAAAugAAAABMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAALyAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLsKcAa0CWAIAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    
    // Initialize app
    initApp();
    
    // Set up event listeners
    todoForm.addEventListener('submit', addTask);
    filterSelect.addEventListener('change', changeFilter);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    editForm.addEventListener('submit', updateTask);
    
    // Update time display
    setInterval(updateTime, 1000);
    updateTime();
    
    // Initialize application
    function initApp() {
        // Load tasks from local storage
        loadTasks();
        
        // Render tasks based on current filter
        renderTasks();
        
        // Update task stats
        updateTaskStats();
        
        // Add initial animation
        document.querySelectorAll('.todo-app > *').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.transitionDelay = `${index * 0.05}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('cyberTasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('cyberTasks', JSON.stringify(tasks));
    }
    
    // Add new task
    function addTask(e) {
        e.preventDefault();
        
        const taskText = todoInput.value.trim();
        if (!taskText) return;
        
        // Get selected priority
        const priorityInput = document.querySelector('input[name="priority"]:checked');
        const priority = priorityInput ? priorityInput.value : 'low';
        
        // Create new task object
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            priority: priority,
            date: new Date().toISOString()
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Play sound
        addSound.currentTime = 0;
        addSound.play();
        
        // Save and render
        saveTasks();
        renderTasks();
        updateTaskStats();
        
        // Clear input
        todoInput.value = '';
        
        // Add visual feedback
        const lastTask = document.querySelector('.task-item:last-child');
        if (lastTask) {
            lastTask.classList.add('highlight');
            setTimeout(() => {
                lastTask.classList.remove('highlight');
            }, 1000);
        }
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        // Clear current list
        todoList.innerHTML = '';
        
        // Get filtered tasks
        const filteredTasks = getFilteredTasks();
        
        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
        
        // Create task elements
        filteredTasks.forEach(task => {
            const taskItem = createTaskElement(task);
            todoList.appendChild(taskItem);
        });
    }
    
    // Get filtered tasks based on current filter
    function getFilteredTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return [...tasks];
        }
    }
    
    // Create task element
    function createTaskElement(task) {
        // Clone the template
        const template = document.getElementById('task-template');
        const taskItem = template.content.cloneNode(true).querySelector('.task-item');
        
        // Set task data
        taskItem.dataset.id = task.id;
        
        // Set task text
        const taskText = taskItem.querySelector('.task-text');
        taskText.textContent = task.text;
        
        // Format date
        const taskDate = taskItem.querySelector('.task-date');
        taskDate.textContent = formatDate(new Date(task.date));
        
        // Set priority
        const priorityBadge = taskItem.querySelector('.priority-badge');
        priorityBadge.textContent = task.priority.toUpperCase();
        priorityBadge.classList.add(task.priority);
        
        // Set completed state
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.checked = task.completed;
        
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        // Event listeners
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id);
        });
        
        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            openEditModal(task);
        });
        
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        return taskItem;
    }
    
    // Format date to readable format
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    // Toggle task completion
    function toggleTaskCompletion(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            
            // Play sound
            completeSound.currentTime = 0;
            completeSound.play();
            
            saveTasks();
            renderTasks();
            updateTaskStats();
        }
    }
    
    // Delete task
    function deleteTask(id) {
        const taskIndex = tasks.findIndex(t => t.id === id);
        
        if (taskIndex !== -1) {
            // Animate task removal
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            if (taskElement) {
                taskElement.style.transform = 'translateX(100%)';
                taskElement.style.opacity = '0';
                
                // Play delete sound
                deleteSound.currentTime = 0;
                deleteSound.play();
                
                // Remove after animation
                setTimeout(() => {
                    tasks.splice(taskIndex, 1);
                    saveTasks();
                    renderTasks();
                    updateTaskStats();
                }, 300);
            }
        }
    }
    
    // Open edit modal
    function openEditModal(task) {
        editingTaskId = task.id;
        editInput.value = task.text;
        
        // Set priority radio
        const priorityRadio = document.querySelector(`input[name="edit-priority"][value="${task.priority}"]`);
        if (priorityRadio) {
            priorityRadio.checked = true;
        }
        
        // Show modal
        editModal.classList.add('active');
        editInput.focus();
        
        // Glitch animation for modal
        const modalContent = editModal.querySelector('.modal-content');
        modalContent.classList.add('glitch-animation');
        setTimeout(() => {
            modalContent.classList.remove('glitch-animation');
        }, 500);
    }
    
    // Close edit modal
    function closeModal() {
        editModal.classList.add('fade-out');
        
        setTimeout(() => {
            editModal.classList.remove('active');
            editModal.classList.remove('fade-out');
        }, 300);
    }
    
    // Update task
    function updateTask(e) {
        e.preventDefault();
        
        const taskText = editInput.value.trim();
        if (!taskText) return;
        
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = taskText;
            
            // Update priority
            const priorityInput = document.querySelector('input[name="edit-priority"]:checked');
            if (priorityInput) {
                task.priority = priorityInput.value;
            }
            
            // Play sound
            addSound.currentTime = 0;
            addSound.play();
            
            saveTasks();
            renderTasks();
            closeModal();
        }
    }
    
    // Change filter
    function changeFilter() {
        currentFilter = filterSelect.value;
        renderTasks();
        
        // Highlight filter select
        filterSelect.classList.add('active-filter');
        setTimeout(() => {
            filterSelect.classList.remove('active-filter');
        }, 300);
    }
    
    // Clear completed tasks
    function clearCompleted() {
        // Get number of completed tasks
        const completedCount = tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) return;
        
        // Add confirmation animation
        clearCompletedBtn.classList.add('confirm-action');
        
        // Delay removal to show animation
        setTimeout(() => {
            tasks = tasks.filter(task => !task.completed);
            
            // Play delete sound
            deleteSound.currentTime = 0;
            deleteSound.play();
            
            saveTasks();
            renderTasks();
            updateTaskStats();
            
            clearCompletedBtn.classList.remove('confirm-action');
        }, 300);
    }
    
    // Update task statistics
    function updateTaskStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        
        totalTasksEl.textContent = totalTasks;
        activeTasksEl.textContent = activeTasks;
        completedTasksEl.textContent = completedTasks;
        
        // Add highlight animation
        [totalTasksEl, activeTasksEl, completedTasksEl].forEach(el => {
            el.classList.add('stat-updated');
            setTimeout(() => {
                el.classList.remove('stat-updated');
            }, 500);
        });
    }
    
    // Update current time
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // Blinking colon effect
        const colon = seconds % 2 === 0 ? ':' : ' ';
        
        timeDisplay.textContent = `${hours}${colon}${minutes}${colon}${seconds}`;
    }
    
    // Add CSS for animations and effects
    const style = document.createElement('style');
    style.textContent = `
        .task-item {
            transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
        }
        
        .task-item.highlight {
            background-color: rgba(0, 255, 225, 0.1);
            box-shadow: 0 0 15px rgba(0, 255, 225, 0.3);
        }
        
        .modal.fade-out .modal-content {
            transform: scale(0.9);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .glitch-animation {
            animation: glitch 0.3s linear;
        }
        
        .confirm-action {
            animation: confirmPulse 0.3s linear;
        }
        
        .stat-updated {
            animation: statUpdate 0.5s ease;
        }
        
        .active-filter {
            animation: filterPulse 0.3s ease;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }
        
        @keyframes confirmPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); background: rgba(255, 42, 109, 0.4); }
            100% { transform: scale(1); }
        }
        
        @keyframes statUpdate {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); color: var(--primary-color); text-shadow: 0 0 10px var(--primary-color); }
            100% { transform: scale(1); }
        }
        
        @keyframes filterPulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 225, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(0, 255, 225, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 225, 0); }
        }
    `;
    document.head.appendChild(style);
}); 