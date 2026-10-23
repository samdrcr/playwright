async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.textContent = `${task.title} [${task.status}]`;
        list.appendChild(div);
    });
}

document.getElementById('submit-btn').addEventListener('click', async () => {
    const titleInput = document.getElementById('title-input');
    const title = titleInput.value.trim();
    
    if (!title) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    titleInput.value = '';
    fetchTasks();
});

fetchTasks();
