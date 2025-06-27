const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clearAll');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];
  let filteredTasks = tasks;

  if (currentFilter === 'today') {
    filteredTasks = tasks.filter(task => task.date === today);
  } else if (currentFilter === 'upcoming') {
    filteredTasks = tasks.filter(task => task.date > today);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-priority', task.priority);

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong>
        <div class="task-meta">${task.date || 'No deadline'}</div>
        <div class="task-actions">
          <button onclick="toggleComplete(${index})"><i class="fas fa-check-circle"></i></button>
          <button class="delete" onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;

    taskList.appendChild(li);
  });

  taskCount.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`;
}

// Add task
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (text === '') return;

  tasks.push({ text, date, priority, completed: false });
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskDate.value = '';
});

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters .active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.innerHTML = document.body.classList.contains('dark')
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Initial render
renderTasks();
