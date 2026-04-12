const API_BASE = "https://jsonplaceholder.typicode.com";

const sections = {
  users: {
    status: document.querySelector("#status-users"),
    list: document.querySelector("#users-list"),
  },
  posts: {
    status: document.querySelector("#status-posts"),
    list: document.querySelector("#posts-list"),
  },
  comments: {
    status: document.querySelector("#status-comments"),
    list: document.querySelector("#comments-list"),
  },
};

const summary = document.querySelector("#summary");
const loading = document.querySelector("#loading");
const usersCount = document.querySelector("#users-count");
const avgComments = document.querySelector("#avg-comments");
const elapsedTime = document.querySelector("#elapsed-time");
const reloadButton = document.querySelector("#reload-btn");

async function fetchData(endpoint) {
  const response = await fetch(API_BASE + endpoint);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

function setStatus(name, type, text) {
  const element = sections[name].status;
  element.textContent = text;
  element.className = `status-pill ${type}`;
}

function renderList(name, items, mapper) {
  const list = sections[name].list;
  list.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Няма налични данни.";
    list.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = mapper(item);
    list.appendChild(li);
  });
}

function renderError(name, message) {
  const list = sections[name].list;
  list.innerHTML = "";
  const li = document.createElement("li");
  li.className = "error-message";
  li.textContent = `Грешка: ${message}`;
  list.appendChild(li);
}

function renderStats(users, posts, comments, elapsed) {
  const commentsCount = comments.reduce((total) => total + 1, 0);
  const average = posts.length > 0 ? commentsCount / posts.length : 0;
  usersCount.textContent = String(users.length);
  avgComments.textContent = average.toFixed(1);
  elapsedTime.textContent = `${elapsed} ms`;
}

function startLoadingState() {
  loading.hidden = false;
  summary.textContent = "Зареждане на потребители, постове и коментари...";
  usersCount.textContent = "0";
  avgComments.textContent = "0.0";
  elapsedTime.textContent = "0 ms";

  Object.keys(sections).forEach((name) => {
    setStatus(name, "loading-status", "Зарежда се...");
    sections[name].list.innerHTML = "";
  });
}

async function loadDashboard() {
  const startTime = Date.now();
  startLoadingState();

  try {
    const [users, posts, comments] = await Promise.all([
      fetchData("/users"),
      fetchData("/posts?_limit=10"),
      fetchData("/comments?_limit=20"),
    ]);

    const elapsed = Date.now() - startTime;
    renderList("users", users, (user) => `${user.name} • ${user.email}`);
    renderList("posts", posts, (post) => post.title);
    renderList("comments", comments, (comment) => `${comment.email} • ${comment.name}`);
    setStatus("users", "success-status", "Заредено");
    setStatus("posts", "success-status", "Заредено");
    setStatus("comments", "success-status", "Заредено");
    renderStats(users, posts, comments, elapsed);
    summary.textContent = "Всички данни са заредени успешно.";
    loading.hidden = true;
  } catch (error) {
    console.error("Promise.all failed:", error.message);
    summary.textContent = `Promise.all failed: ${error.message}`;

    try {
      const results = await Promise.allSettled([
        fetchData("/users"),
        fetchData("/posts?_limit=10"),
        fetchData("/comments?_limit=20"),
      ]);

      const elapsed = Date.now() - startTime;
      const names = ["users", "posts", "comments"];
      const fulfilled = { users: [], posts: [], comments: [] };

      results.forEach((result, index) => {
        const name = names[index];
        if (result.status === "fulfilled") {
          fulfilled[name] = result.value;
          setStatus(name, "success-status", "Заредено");
          if (name === "users") {
            renderList(name, result.value, (user) => `${user.name} • ${user.email}`);
          }
          if (name === "posts") {
            renderList(name, result.value, (post) => post.title);
          }
          if (name === "comments") {
            renderList(name, result.value, (comment) => `${comment.email} • ${comment.name}`);
          }
        } else {
          setStatus(name, "error-status", "Грешка");
          renderError(name, result.reason.message);
        }
      });

      renderStats(fulfilled.users, fulfilled.posts, fulfilled.comments, elapsed);
      summary.textContent = "Показани са всички налични резултати след fallback към Promise.allSettled.";
    } catch (fallbackError) {
      summary.textContent = `Грешка при fallback: ${fallbackError.message}`;
      Object.keys(sections).forEach((name) => {
        setStatus(name, "error-status", "Грешка");
        renderError(name, fallbackError.message);
      });
    } finally {
      loading.hidden = true;
    }
  }
}

reloadButton.addEventListener("click", loadDashboard);

loadDashboard();
