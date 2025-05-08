const form = document.querySelector("#form");
const taskTitleInput = document.querySelector("#taskTitle");
const taskDescriptionInput = document.querySelector("#taskDescription");
const taskDeadlineInput = document.querySelector("#taskDeadline");
const taskCategoryInput = document.querySelector("#taskCategory");
const tasksList = document.querySelector("#tasksList");
const EmptyList = document.querySelector("#emptyList");

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);
tasksList.addEventListener("click", showDescription);
tasksList.addEventListener("click", editTask);

// ФУНКЦІЇ
function addTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const deadline = taskDeadlineInput.value;
  const category = taskCategoryInput.value;

  const iconPath = window.location.origin + "/img/";

  const taskHtml = `
  <li class="list-group-item d-flex flex-column task-item">
    <div class="d-flex justify-content-between align-items-center w-100">
      <div>
        <span class="task-title font-weight-bold">${title}</span>
        <span class="badge badge-secondary ml-2">${category}</span>
        <span class="badge badge-light ml-2">${deadline}</span>
      </div>
      <div class="task-item__buttons">
        <button type="button" class="btn-action" data-action="done">
          <img src="${iconPath}tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" class="btn-action" data-action="delete">
          <img src="${iconPath}cross.svg" alt="Delete" width="18" height="18">
        </button>
        <button type="button" class="btn-action" data-action="more">
          <img src="${iconPath}more.png" alt="More" width="18" height="18">
        </button>
        <button type="button" class="btn-action" data-action="edit">
          <img src="${iconPath}edit.png" alt="Edit" width="18" height="18">
        </button>
      </div>
    </div>
    <div class="task-description mt-2 text-muted d-none">
      ${description || "Опис відсутній"}
    </div>
  </li>
`;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);

  // Очистити поля
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  taskDeadlineInput.value = "";
  taskCategoryInput.value = "Загальне";

  if (tasksList.children.length > 1) {
    EmptyList.classList.add("none");
  }
}
function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest(".task-item");
  parentNode.remove();
  if (tasksList.children.length === 1) {
    EmptyList.classList.remove("none");
  }
}
function doneTask(event) {
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest(".list-group-item");
    const taskTitle = parentNode
      .querySelector(".task-title")
      .classList.toggle("task-title--done");
  }
}
function showDescription(event) {
  const actionBtn = event.target.closest("button");
  if (!actionBtn || actionBtn.dataset.action !== "more") return;

  const parentNode = actionBtn.closest(".task-item");
  const descBlock = parentNode.querySelector(".task-description");
  descBlock.classList.toggle("d-none");
}
function editTask(event) {
  const actionBtn = event.target.closest("[data-action='edit']");
  if (!actionBtn) return;

  const taskItem = actionBtn.closest(".task-item");

  const titleSpan = taskItem.querySelector(".task-title");
  const descBlock = taskItem.querySelector(".task-description");
  const categoryBadge = taskItem.querySelector(".badge-secondary");
  const deadlineBadge = taskItem.querySelector(".badge-light");

  const newTitleInput = document.createElement("input");
  newTitleInput.type = "text";
  newTitleInput.value = titleSpan.textContent;
  newTitleInput.classList.add("form-control", "mb-1");

  const newDescInput = document.createElement("textarea");
  newDescInput.value =
    descBlock.textContent === "Опис відсутній" ? "" : descBlock.textContent;
  newDescInput.classList.add("form-control", "mb-1");

  const newCategoryInput = document.createElement("input");
  newCategoryInput.type = "text";
  newCategoryInput.value = categoryBadge.textContent;
  newCategoryInput.classList.add("form-control", "mb-1");

  const newDeadlineInput = document.createElement("input");
  newDeadlineInput.type = "date";
  newDeadlineInput.value = deadlineBadge.textContent;
  newDeadlineInput.classList.add("form-control", "mb-2");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Зберегти";
  saveBtn.classList.add("btn", "btn-success", "btn-sm");

  const editForm = document.createElement("div");
  editForm.classList.add("mt-2");
  editForm.append(
    newTitleInput,
    newDescInput,
    newCategoryInput,
    newDeadlineInput,
    saveBtn
  );

  titleSpan.style.display = "none";
  descBlock.classList.add("d-none");
  categoryBadge.style.display = "none";
  deadlineBadge.style.display = "none";
  taskItem.appendChild(editForm);

  saveBtn.addEventListener("click", () => {
    titleSpan.textContent = newTitleInput.value.trim() || "Без назви";
    descBlock.textContent = newDescInput.value.trim() || "Опис відсутній";
    categoryBadge.textContent = newCategoryInput.value.trim() || "Загальне";
    deadlineBadge.textContent = newDeadlineInput.value || "Без дати";

    titleSpan.style.display = "";
    descBlock.classList.remove("d-none");
    categoryBadge.style.display = "";
    deadlineBadge.style.display = "";

    editForm.remove();
  });
}
//Lab1
import { quotes } from "./quotes.js";
function* quoteGenerator() {
  let i = 0;
  while (true) {
    yield quotes[i];
    i = (i + 1) % quotes.length;
  }
}

async function showQuotesWithTimeout(generator, seconds, elementId) {
  const element = document.getElementById(elementId);
  const start = Date.now();
  const duration = seconds * 1000;

  try {
    while (Date.now() - start < duration) {
      const { value, done } = generator.next();
      if (done) break;

      element.textContent = value;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    element.textContent = "Готово! Хочеш ще — натисни знову.";
  } catch (error) {
    console.error("Помилка:", error);
    element.textContent = "Сталася помилка при показі цитат";
  }
}

const quoteGen = quoteGenerator();
document.getElementById("quoteBtn").addEventListener("click", () => {
  showQuotesWithTimeout(quoteGen, 15, "quoteText");
});

if (data.success) {
  window.location.href = "/planner.html";
}
