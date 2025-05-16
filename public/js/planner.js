import { quotes } from "./quotes.js";
import { createTaskHtml } from "./createTask.js";
import { memoize } from "./memoize.js";
import { weatherProxy } from "./weatherProxy.js";

const form = document.querySelector("#form");
const taskTitleInput = document.querySelector("#taskTitle");
const taskDescriptionInput = document.querySelector("#taskDescription");
const taskDeadlineInput = document.querySelector("#taskDeadline");
const taskCategoryInput = document.querySelector("#taskCategory");
const tasksList = document.querySelector("#tasksList");
const emptyListMsg = document.querySelector("#emptyList");
const quoteBtn = document.getElementById("quoteBtn");

const iconPath = `${window.location.origin}/img/`;

const addTask = (event) => {
  event.preventDefault();

  const newTask = {
    title: taskTitleInput.value.trim() || "Без назви",
    description: taskDescriptionInput.value.trim(),
    deadline: taskDeadlineInput.value || "Без дати",
    category: taskCategoryInput.value || "Загальне",
  };

  tasksList.insertAdjacentHTML("beforeend", createTaskHtml(newTask, iconPath));

  form.reset();
  taskCategoryInput.value = "Загальне";

  if (tasksList.querySelectorAll(".task-item").length > 0) {
    emptyListMsg.classList.add("none");
  }
  updatePerformanceAnalysis();
};

const handleTaskActions = (event) => {
  const actionBtn = event.target.closest("button[data-action]");
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  const taskItem = actionBtn.closest(".task-item");

  const actionMap = {
    delete: () => {
      taskItem.remove();
      if (tasksList.querySelectorAll(".task-item").length === 0) {
        emptyListMsg.classList.remove("none");
      }
      updatePerformanceAnalysis();
    },
    done: () => {
      const title = taskItem.querySelector(".task-title");
      title.classList.toggle("task-title--done");
      updatePerformanceAnalysis();
    },
    more: () => {
      const desc = taskItem.querySelector(".task-description");
      desc.classList.toggle("d-none");
    },
    edit: () => {
      const titleSpan = taskItem.querySelector(".task-title");
      const descBlock = taskItem.querySelector(".task-description");
      const categoryBadge = taskItem.querySelector(".badge-secondary");
      const deadlineBadge = taskItem.querySelector(".badge-light");

      const newTitleInput = document.createElement("input");
      newTitleInput.type = "text";
      newTitleInput.value = titleSpan.textContent;
      newTitleInput.className = "form-control mb-1";

      const newDescInput = document.createElement("textarea");
      newDescInput.value =
        descBlock.textContent === "Опис відсутній" ? "" : descBlock.textContent;
      newDescInput.className = "form-control mb-1";

      const newCategoryInput = document.createElement("input");
      newCategoryInput.type = "text";
      newCategoryInput.value = categoryBadge.textContent;
      newCategoryInput.className = "form-control mb-1";

      const newDeadlineInput = document.createElement("input");
      newDeadlineInput.type = "date";
      newDeadlineInput.value = deadlineBadge.textContent;
      newDeadlineInput.className = "form-control mb-2";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Зберегти";
      saveBtn.className = "btn btn-success btn-sm";

      const editForm = document.createElement("div");
      editForm.className = "mt-2";
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
    },
  };

  if (action in actionMap) {
    actionMap[action]();
  }
};

const quoteGenerator = function* () {
  let i = 0;
  while (true) {
    yield quotes[i];
    i = (i + 1) % quotes.length;
  }
};

const showQuotesWithTimeout = async (generator, seconds, elementId) => {
  const element = document.getElementById(elementId);
  const start = Date.now();
  const duration = seconds * 1000;

  try {
    while (Date.now() - start < duration) {
      const { value } = generator.next();
      element.textContent = value;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    element.textContent = "Готово! Хочеш ще — натисни знову.";
  } catch (error) {
    console.error("Помилка:", error);
    element.textContent = "Сталася помилка при показі цитат";
  }
};

const initializePlannerEvents = () => {
  form.addEventListener("submit", addTask);
  tasksList.addEventListener("click", handleTaskActions);
  quoteBtn.addEventListener("click", () => {
    showQuotesWithTimeout(quoteGen, 15, "quoteText");
  });
};

const quoteGen = quoteGenerator();
initializePlannerEvents();

const analyzeProductivity = (tasksCompleted) =>
  `Ви виконали ${tasksCompleted} завдань сьогодні!`;

const memoizedAnalyze = memoize(analyzeProductivity, 100);

const updatePerformanceAnalysis = () => {
  const doneTasks = document.querySelectorAll(".task-title--done").length;
  const message = memoizedAnalyze(doneTasks);

  const performanceElement = document.getElementById("performance");
  if (performanceElement) {
    performanceElement.textContent = message;
  }
};

async function showWeather() {
  const weather = await weatherProxy.getWeather("Kyiv");
  const weatherElement = document.getElementById("weatherDisplay");

  weatherElement.innerHTML = `
    <strong>${weather.name}</strong>: 
    ${weather.main.temp}°C, 
    ${weather.weather[0].description}
  `;
}

document.getElementById("weatherBtn").addEventListener("click", showWeather);
