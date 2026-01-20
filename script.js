const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");


addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});


function normalizeText(s) {
    return s.replace(/\s+/g, ' ').trim().toLowerCase();
}


function isDuplicate(normalizedText, currentDiv = null) {
    const lists = [taskList, completedList];
    for (const list of lists) {
        for (const child of list.children) {
            if (child === currentDiv) continue;
            const sp = child.querySelector('span');
            if (!sp) continue;
            if (normalizeText(sp.innerText) === normalizedText) return true;
        }
    }
    return false;
}

function addTask() {
    const taskTextRaw = taskInput.value;
    const taskText = taskTextRaw.replace(/\s+/g, ' ').trim();
    const normalizedText = normalizeText(taskText);

    if (taskText === "") {
        taskInput.style.border = "2px solid red";
        alert("Please enter a task.");
        return;
    } else {
        taskInput.style.border = "2px solid grey";
    }


    if (isDuplicate(normalizedText)) {
        taskInput.style.border = "2px solid red";
        alert("Task already exists.");
        return;
    }


    const taskDiv = document.createElement("div");
    taskDiv.className = "task";


    const span = document.createElement("span");
    span.innerText = taskText;


    const actions = document.createElement("div");
    actions.className = "actions";


    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';


    const completeBtn = document.createElement("button");
    completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

    const combtn = document.createElement("input");
    combtn.type = "checkbox";


    function markCompleted() {
        taskDiv.classList.add("completed");
        completeBtn.style.display = "none";
        editBtn.style.display = "none";
        completedList.appendChild(taskDiv);
    }

    function markPending() {
        taskDiv.classList.remove("completed");
        completeBtn.style.display = "";
        editBtn.style.display = "";
        taskList.appendChild(taskDiv);
    }


    taskList.appendChild(taskDiv);


    combtn.addEventListener("change", () => {
        if (combtn.checked) {
            markCompleted();
        } else {
            markPending();
        }
        updateCounts();
    });


    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    actions.append(editBtn, deleteBtn);
    taskDiv.append(combtn, span, actions);

    taskInput.value = "";



    let isEditing = false;
    let prevText = "";
    let ignoreBlur = false;

    function onEditKeydown(e) {
        if (e.key === "Enter") {

            e.preventDefault();
            return;
        }
    }

    function onEditMousedown() {

        ignoreBlur = true;
        setTimeout(() => {
            ignoreBlur = false;
        }, 0);
    }

    function onEditBlur() {

        if (ignoreBlur) return;

        cancelEditing();
    }

    function startEditing() {
        isEditing = true;
        prevText = span.innerText;
        span.contentEditable = true;
        span.focus();
        document.execCommand("selectAll", false, null);
        document.getSelection().collapseToEnd();
        editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        span.addEventListener("keydown", onEditKeydown);
        span.addEventListener("blur", onEditBlur);
        editBtn.addEventListener("mousedown", onEditMousedown);
    }

    function saveEditing() {
        const editedRaw = span.innerText;
        const cleaned = editedRaw.replace(/\s+/g, ' ').trim();
        const normalized = normalizeText(cleaned);


        if (cleaned === "") {
            alert("Task cannot be empty.");
            span.innerText = prevText;
            span.focus();
            document.execCommand("selectAll", false, null);
            return;
        }


        if (isDuplicate(normalized, taskDiv)) {
            alert("Task already exists.");
            span.focus();
            document.execCommand("selectAll", false, null);
            return;
        }

        // finalize save
        span.innerText = cleaned;
        endEditing();
        updateCounts();
    }

    function cancelEditing() {
        span.innerText = prevText;
        endEditing();
    }

    function endEditing() {
        isEditing = false;
        span.contentEditable = false;
        span.removeEventListener("keydown", onEditKeydown);
        span.removeEventListener("blur", onEditBlur);
        editBtn.removeEventListener("mousedown", onEditMousedown);
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        span.blur();
    }

    editBtn.addEventListener("click", () => {
        if (isEditing) {
            saveEditing();
        } else {
            startEditing();
        }
    });


    completeBtn.addEventListener("click", () => {

        combtn.checked = true;
        markCompleted();
        updateCounts();
    });


    deleteBtn.addEventListener("click", () => {
        taskDiv.remove();
        updateCounts();
    });

    updateCounts();
}


function updateCounts() {
    const pendingTasks = taskList.children.length;
    const completedTasks = completedList.children.length;

    totalCount.textContent = pendingTasks + completedTasks;
    completedCount.textContent = completedTasks;
    pendingCount.textContent = pendingTasks;
}
