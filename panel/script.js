// =====================
// Utilities
// =====================
function show(el) {
  el.style.display = "flex";
  requestAnimationFrame(() => {
    el.classList.add("active");
  });
}

function hide(el) {
  el.classList.remove("active");
  setTimeout(() => {
    el.style.display = "none";
  }, 350);
}
function fetchAPI(url, password, method = "GET", options = {}) {
  return fetch(url, { headers: { password }, method, ...options });
}

// =====================
// Globals
// =====================
let AccentColor;
let BotData;
let BotGuilds;

// =====================
// Accent color extraction
// =====================
function setAccentColor(color) {
  let r, g, b;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return;
    [r, g, b] = match.map(Number);
  }

  // Relative luminance (WCAG)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const MAX_LUMA = 180; // tweak: lower = darker UI
  if (luminance > MAX_LUMA) {
    const scale = MAX_LUMA / luminance;
    r = Math.round(r * scale);
    g = Math.round(g * scale);
    b = Math.round(b * scale);
  }

  document.documentElement.style.setProperty(
    "--accent-rgb",
    `${r}, ${g}, ${b}`,
  );
}

async function extractAccentColor(imgUrl) {
  if (AccentColor) return AccentColor;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4 * 50) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      AccentColor = `rgb(${(r / count) | 0}, ${(g / count) | 0}, ${(b / count) | 0})`;
      resolve(AccentColor);
    };

    img.onerror = () => resolve("rgb(10, 132, 255)");
  });
}

// =====================
// Password validation (NO UI LOGIC)
// =====================
async function validatePassword(pw) {
  try {
    const res = await fetch(`/password?password=${encodeURIComponent(pw)}`);
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

// =====================
// Logout
// =====================
function logout() {
  localStorage.removeItem("panelAuth");
  BotData = null;

  hide(document.getElementById("panel"));
  show(document.getElementById("password-screen"));
}

// =====================
// Login submit
// =====================
async function submitPassword() {
  const pw = document.getElementById("password-input").value;
  const valid = await validatePassword(pw);

  if (!valid) {
    document.getElementById("error").style.display = "block";
    return;
  }

  localStorage.setItem("panelAuth", pw);
  loadPanel();
}

// =====================
// Panel loader
// =====================
function loadPanel() {
  const login = document.getElementById("password-screen");
  const panel = document.getElementById("panel");

  hide(login);

  // slight delay
  setTimeout(() => {
    show(panel);
    fetchBotData();
    loadGuilds();
  }, 120);
}

// =====================
// Fetch bot data (NO validation here)
// =====================
async function fetchBotData() {
  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  try {
    let bot;
    if (BotData) {
      bot = BotData;
    } else {
      bot = BotData = await fetchAPI(`/api/bot`, pw).then((x) => x.json());
    }

    // UI fill
    document.getElementById("bot-name").innerText =
      bot.user?.tag ?? "Unknown Bot";
    document.getElementById("bot-desc").innerText =
      bot.application?.description ?? "No description";

    document.getElementById("bot-avatar").src = bot.user.avatar;

    const accent = await extractAccentColor(bot.user.avatar);
    setAccentColor(accent);

    if (bot.user.banner) {
      document.getElementById("bot-banner").src = bot.user.banner;
    } else {
      const banner = document.createElement("canvas");
      banner.width = 600;
      banner.height = 200;
      const ctx = banner.getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, 600, 200);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, "#000");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 200);

      document.getElementById("bot-banner").src = banner.toDataURL();
    }

    document.getElementById("invite-btn").onclick = () =>
      window.open(
        `https://discord.com/oauth2/authorize?client_id=${bot.user.id}`,
        "_blank",
      );

    document.getElementById("guilds").innerText = bot.stats?.guilds ?? 0;
    document.getElementById("members").innerText = bot.stats?.users ?? 0;

    updateUptime(bot.stats?.uptime ?? 0);
    document.title = `${bot.user.username} Panel`;
  } catch {
    document.getElementById("guilds").innerText = "ERR";
    document.getElementById("members").innerText = "ERR";
  }
}

// =====================
// Uptime formatter
// =====================
function updateUptime(initialMs) {
  let ms = initialMs;
  const el = document.getElementById("uptime");

  const format = (ms) => {
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;

    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)}m`;

    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)}h`;

    const days = hours / 24;
    return `${days.toFixed(1)}d`;
  };

  setInterval(() => {
    ms += 10_000;
    el.textContent = format(ms);
  }, 10_000);
}

// =====================
// Guild Pagination
// =====================
let currentPage = 1;
function getGuildsPerPage() {
  return window.innerWidth <= 900 ? 8 : 9;
}
window.addEventListener("resize", () => {
  renderGuildsPage(currentPage);
});
function renderGuildsPage(page = 1) {
  const list = document.getElementById("guild-list");
  list.innerHTML = "";

  if (!BotGuilds || !BotGuilds.length) return;
  const perPage = getGuildsPerPage();
  const totalPages = Math.ceil(BotGuilds.length / perPage);

  // Clamp page: if requested page > totalPages, go to last page
  currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  const pageGuilds = BotGuilds.slice(start, end);

  const template = document.getElementById("guild-card-template");

  for (const g of pageGuilds) {
    const card = template.content.cloneNode(true);

    const icon = card.querySelector(".guild-icon");
    const name = card.querySelector(".guild-name");
    const id = card.querySelector(".guild-id");
    const btn = card.querySelector(".guild-open");

    icon.src = g.icon ?? "/fallback-guild.png";
    name.textContent = g.name;
    id.textContent = g.id;
    btn.onclick = () => {
      const searchParams = new URLSearchParams();
      searchParams.set("tab", "manage-guild");
      searchParams.set("id", g.id);
      window.history.pushState({}, "", `?${searchParams.toString()}`);
      openGuildPanel(g);
    };

    list.appendChild(card);
  }

  renderGuildPaginationControls();
}

function renderGuildPaginationControls() {
  const containerId = "guild-pagination";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "12px";
    container.style.marginTop = "16px";
    document.getElementById("panel").appendChild(container);
  }

  container.innerHTML = "";

  const totalPages = Math.ceil(BotGuilds.length / getGuildsPerPage());

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "◀ Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderGuildsPage(currentPage);
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next ▶";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderGuildsPage(currentPage);
  };

  const pageIndicator = document.createElement("span");
  pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
  pageIndicator.style.alignSelf = "center";
  pageIndicator.style.color = "var(--text-sub)";
  pageIndicator.style.fontSize = "0.9rem";

  container.appendChild(prevBtn);
  container.appendChild(pageIndicator);
  container.appendChild(nextBtn);
}

// =====================
// Fetch bot guilds
// =====================
async function loadGuilds() {
  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  if (!BotGuilds) {
    BotGuilds = await fetchAPI(`/api/guilds`, pw).then((x) => x.json());
  }

  currentPage = 1;
  renderGuildsPage(currentPage);
}
// =====================
// Show the guild info
// =====================
function openGuildPanel(guild) {
  // hide main panel
  hide(document.getElementById("panel"));

  // show guild panel
  const guildPanel = document.getElementById("guild-panel");
  show(guildPanel);

  document.getElementById("guild-name-header").textContent = guild.name;
  document.getElementById("guild-id-header").textContent = `ID: ${guild.id}`;

  const content = document.getElementById("guild-content");
  content.innerHTML = `<p>Loading data for <strong>${guild.name}</strong>...</p>`;

  const pw = localStorage.getItem("panelAuth");
  fetchAPI(`/api/guild/${guild.id}`, pw)
    .then((res) => res.json())
    .then((data) => {
      content.innerHTML = `
        <p><strong>Guild Name:</strong> ${data.name}</p>
        <p><strong>Members:</strong> ${data.count.members ?? 0}</p>
        <p><strong>Channels:</strong> ${data.count.channels ?? 0}</p>
      `;
    })
    .catch((err) => {
      content.innerHTML = `<p style="color:red;">Failed to load guild data.</p>`;
    });
}

document.getElementById("back-btn").onclick = () => {
  const url = new URL(window.location);
  url.searchParams.set("tab", "panel");
  window.history.pushState({}, "", url);

  hide(document.getElementById("guild-panel"));
  show(document.getElementById("panel"));
};

// =====================
// On load
// =====================
window.onload = async () => {
  const login = document.getElementById("password-screen");
  show(login);

  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  const valid = await validatePassword(pw);
  if (!valid) {
    localStorage.removeItem("panelAuth");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");

  if (tab === "manage-guild" && params.get("id")) {
    loadPanel(); // still need bot data for sidebar/stats
    const guild = BotGuilds?.find((g) => g.id === params.get("id"));
    if (guild) openGuildPanel(guild);
  } else {
    loadPanel();
  }
};
