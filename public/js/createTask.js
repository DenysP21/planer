export const createTaskHtml = (
  { title, description, deadline, category },
  iconPath
) => `
  <li class="list-group-item d-flex flex-column task-item">
    <div class="d-flex justify-content-between align-items-center w-100">
      <div>
        <span class="task-title font-weight-bold">${title}</span>
        <span class="badge badge-secondary ml-2">${category}</span>
        <span class="badge badge-light ml-2">${deadline}</span>
      </div>
      <div class="task-item__buttons">
        <button type="button" class="btn-action" data-action="done" aria-label="Позначити виконаним">
          <img src="${iconPath}tick.svg" alt="Done" width="18" height="18" />
        </button>
        <button type="button" class="btn-action" data-action="delete" aria-label="Видалити">
          <img src="${iconPath}cross.svg" alt="Delete" width="18" height="18" />
        </button>
        <button type="button" class="btn-action" data-action="more" aria-label="Показати опис">
          <img src="${iconPath}more.png" alt="More" width="18" height="18" />
        </button>
        <button type="button" class="btn-action" data-action="edit" aria-label="Редагувати">
          <img src="${iconPath}edit.png" alt="Edit" width="18" height="18" />
        </button>
      </div>
    </div>
    <div class="task-description mt-2 text-muted d-none">
      ${description || "Опис відсутній"}
    </div>
  </li>
`;
