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
    
    if (tasks.length === 0) {
        list.innerHTML = '<p style="color: #64748b; text-align: center; margin: 1rem 0;">No tasks yet. Add one above!</p>';
        return;
    }

    tasks.forEach((task, index) => {
        const status = task.status || 'pending';
        
        const div = document.createElement('div');
        div.className = `task-card ${status}`;
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = task.title;

        const badge = document.createElement('span');
        badge.className = 'task-badge';
        badge.textContent = status;

        div.appendChild(titleSpan);
        div.appendChild(badge);
        
        div.addEventListener('click', async () => {
            task.status = status === 'pending' ? 'completed' : 'pending';
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

document.getElementById('title-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submit-btn').click();
    }
});

fetchTasks();
