document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const msg = document.getElementById("registerMessage");
    if (res.ok) {
      msg.textContent = "Реєстрація успішна! Переходимо...";
      setTimeout(() => (window.location.href = "/planner.html"), 1000);
    } else {
      msg.textContent = "Помилка: такий користувач вже існує?";
    }
  });

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const msg = document.getElementById("loginMessage");
  if (res.ok) {
    msg.textContent = "Вхід успішний! Переходимо...";
    setTimeout(() => (window.location.href = "/planner.html"), 1000);
  } else {
    msg.textContent = "Помилка: невірний email або пароль";
  }
});
// Перемикання між вкладками входу та реєстрації
document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
  const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");

  if (loginTab && registerTab && loginSection && registerSection) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginSection.classList.add("active");
      registerSection.classList.remove("active");
    });

    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      registerSection.classList.add("active");
      loginSection.classList.remove("active");
    });
  }
});
