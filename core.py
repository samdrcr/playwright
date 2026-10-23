tasks = []
task_id_counter = 1

def get_tasks():
    return tasks

def add_task(title, description=""):
    global task_id_counter
    if not title or not title.strip():
        raise ValueError("Task title cannot be empty")
    
    task = {
        "id": task_id_counter,
        "title": title.strip(),
        "description": description.strip(),
        "status": "pending"
    }
    tasks.append(task)
    task_id_counter += 1
    return task

def clear_tasks():
    global tasks, task_id_counter
    tasks = []
    task_id_counter = 1
