const elementInput = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-btn");
const tasksListContainer = document.querySelector(".tasks-list-container");

const validateInput = () => {
  return elementInput.value.trim().length > 0;
  //checar se for zero ('sem nada', o trim tira os espaços brancos)
};

//checar se input válido
const handleAddTask = () => {
  const isInputValid = validateInput();

  if (!isInputValid) {
    return elementInput.classList.add("error");
  }

  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskName = document.createElement("p");
  taskName.innerText = elementInput.value;

  taskName.addEventListener("click", () => handleClick(taskName));

  const itemDelete = document.createElement("i");
  itemDelete.classList.add("fas", "fa-trash-alt");

  itemDelete.addEventListener("click", () =>
    handleDeleteClick(taskItemContainer, taskName)
  );

  taskItemContainer.appendChild(taskName);
  taskItemContainer.appendChild(itemDelete);
  tasksListContainer.appendChild(taskItemContainer);

  elementInput.value = "";

  updateLocalStorage();
};

const handleClick = (taskName) => {
  const tasks = tasksListContainer.childNodes;
  //percorremos todos filhos/itens das tarefas (div e p) e procuramos se no loop o item atual é o mesmo que clicamos (qual é)
  //se sim, alteramos a class e estilo "concluído"
  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskName);

    if (currentTaskIsBeingClicked) {
      task.firstChild.classList.toggle("completed");
    }
  }

  updateLocalStorage();
};

const handleDeleteClick = (taskItemContainer, taskName) => {
  const tasks = tasksListContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskName);

    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }

  updateLocalStorage();
};

const handleInputChange = () => {
  const isInputValid = validateInput();

  if (isInputValid) {
    return elementInput.classList.remove("error");
  }
};

const updateLocalStorage = () => {
  const tasks = tasksListContainer.childNodes;

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild;
    const isCompleted = content.classList.contains("completed");

    return { description: content.innerText, isCompleted };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskName = document.createElement("p");
    taskName.innerText = task.description;

    if (task.isCompleted) {
      taskName.classList.add("completed");
    }

    taskName.addEventListener("click", () => handleClick(taskName));

    const itemDelete = document.createElement("i");
    itemDelete.classList.add("fas", "fa-trash-alt");

    itemDelete.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskName)
    );

    taskItemContainer.appendChild(taskName);
    taskItemContainer.appendChild(itemDelete);
    tasksListContainer.appendChild(taskItemContainer);
  }
};

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());

elementInput.addEventListener("change", () => handleInputChange());
