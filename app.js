const isGitHubPages = window.location.hostname.includes('github.io');

async function fetchTasks() {
    let tasks = [];
    
    if (isGitHubPages) {
        tasks = JSON.parse(localStorage.getItem('hw7_tasks') || '[]');
    } else {
        const response = await fetch('/api/tasks');
        tasks = await response.json();
    }
    
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.textContent = `${task.title} [${task.status || 'pending'}]`;
        list.appendChild(div);
    });
}

document.getElementById('submit-btn').addEventListener('click', async () => {
    const titleInput = document.getElementById('title-input');
    const title = titleInput.value.trim();
    
    if (!title) return;

    if (isGitHubPages) {
        const tasks = JSON.parse(localStorage.getItem('hw7_tasks') || '[]');
        tasks.push({ title, status: 'pending' });
        localStorage.setItem('hw7_tasks', JSON.stringify(tasks));
    } else {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
    }

    titleInput.value = '';
    fetchTasks();
});

fetchTasks();
