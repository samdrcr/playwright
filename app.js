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
    
    tasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
        div.textContent = `${task.title} [${task.status || 'pending'}]`;
        
        // Click to toggle status
        div.style.cursor = 'pointer';
        div.addEventListener('click', async () => {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
            if (isGitHubPages) {
                localStorage.setItem('hw7_tasks', JSON.stringify(tasks));
                fetchTasks();
            }
        });

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
