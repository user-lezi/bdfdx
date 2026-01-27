function show(el) {
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.classList.remove("opacity-0", "scale-90");
  });
}

function hide(el) {
  el.classList.add("opacity-0", "scale-90");
  setTimeout(() => el.classList.add("hidden"), 300);
}

const PANELS = {
  login: "password-screen",
  panel: "panel",
  guild: "guild-panel",
  user: "user-panel",
};

let __p = null;

function showPanel(name) {
  const id = PANELS[name] ?? name;
  if (__p === id) return;

  console.log("[ui] showPanel:", id);

  for (const pid of Object.values(PANELS)) {
    const el = document.getElementById(pid);
    if (!el) continue;
    pid === id ? show(el) : hide(el);
  }

  __p = id;
}

function fetchAPI(url, password, method = "GET", options = {}) {
  return fetch(url, { method, headers: { password }, ...options });
}

let CurrentAccentColor;
let AccentColorCache = {};
let BotData;
let BotGuilds;
let currentPage = 1;

function setAccentColor(color) {
  if (color === CurrentAccentColor) return;
  CurrentAccentColor = color;

  let [r, g, b] = color.match(/\d+/g).map(Number);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  if (lum > 180) {
    const k = 180 / lum;
    r = (r * k) | 0;
    g = (g * k) | 0;
    b = (b * k) | 0;
  }

  document.documentElement.style.setProperty(
    "--accent-rgb",
    `${r}, ${g}, ${b}`,
  );

  console.log("[accent]", r, g, b);
}

async function extractAccentColor(src, refresh = false) {
  if (AccentColorCache[src] && !refresh) return AccentColorCache[src];

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const c = document.createElement("canvas");
      const x = c.getContext("2d");
      c.width = img.width;
      c.height = img.height;
      x.drawImage(img, 0, 0);

      const d = x.getImageData(0, 0, c.width, c.height).data;
      let r = 0,
        g = 0,
        b = 0,
        n = 0;

      for (let i = 0; i < d.length; i += 200) {
        r += d[i];
        g += d[i + 1];
        b += d[i + 2];
        n++;
      }

      resolve(`rgb(${(r / n) | 0}, ${(g / n) | 0}, ${(b / n) | 0})`);
    };

    img.onerror = () => resolve("rgb(88,101,242)");
  }).then((c) => (AccentColorCache[src] = c));
}

async function validatePassword(pw) {
  try {
    const r = await fetch(`/password?password=${encodeURIComponent(pw)}`);
    return (await r.json()).valid === true;
  } catch {
    return false;
  }
}

function logout() {
  console.log("[auth] logout");
  localStorage.removeItem("panelAuth");
  history.replaceState({}, "", "?");
  showPanel("login");
}

async function submitPassword() {
  const pw = document.getElementById("password-input").value;
  if (!(await validatePassword(pw))) return;

  localStorage.setItem("panelAuth", pw);
  history.replaceState({}, "", "?tab=panel");
  loadPanel();
}

function loadPanel() {
  console.log("[panel] load");
  showPanel("panel");
  fetchBotData();
  loadGuilds();
}

async function fetchBotData() {
  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  console.log("[bot] fetching");

  BotData ??= await fetchAPI("/api/bot", pw).then((r) => r.json());

  document.getElementById("bot-name").textContent =
    BotData.user?.tag ?? "Unknown";
  document.getElementById("bot-desc").textContent =
    BotData.application?.description ?? "";
  document.getElementById("bot-avatar").src = BotData.user.avatar;

  extractAccentColor(BotData.user.avatar).then(setAccentColor);

  if (BotData.user.banner) {
    document.getElementById("bot-banner").src = BotData.user.banner;
  }

  document.getElementById("guilds").textContent = BotData.stats?.guilds ?? 0;
  document.getElementById("members").textContent = BotData.stats?.users ?? 0;

  updateUptime(BotData.stats?.uptime ?? 0);
  document.title = `${BotData.user.username} Panel`;
}

function updateUptime(ms) {
  const el = document.getElementById("uptime");

  const fmt = (ms) => {
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}s`;
    const m = s / 60;
    if (m < 60) return `${m.toFixed(1)}m`;
    const h = m / 60;
    if (h < 24) return `${h.toFixed(1)}h`;
    return `${(h / 24).toFixed(1)}d`;
  };

  el.textContent = fmt(ms);

  setInterval(() => {
    ms += 10_000;
    el.textContent = fmt(ms);
  }, 10_000);
}

function guildsPerPage() {
  return innerWidth <= 900 ? 8 : 9;
}

window.addEventListener("resize", () => {
  renderGuildsPage(currentPage);
});

async function loadGuilds() {
  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  console.log("[guilds] fetching");

  BotGuilds ??= await fetchAPI("/api/guilds", pw).then((r) => r.json());
  renderGuildsPage(currentPage);
}

function renderGuildsPage(page) {
  const list = document.getElementById("guild-list");
  if (!list || !BotGuilds) return;

  list.innerHTML = "";

  const perPage = guildsPerPage();
  const pages = Math.ceil(BotGuilds.length / perPage);
  currentPage = Math.min(Math.max(page, 1), pages);

  const start = (currentPage - 1) * perPage;
  const slice = BotGuilds.slice(start, start + perPage);
  const tpl = document.getElementById("guild-card-template");

  for (const g of slice) {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".guild-icon").src = g.icon ?? "/fallback-guild.png";
    node.querySelector(".guild-name").textContent = g.name;
    node.querySelector(".guild-id").textContent = g.id;
    node.querySelector(".guild-open").onclick = () => openGuild(g);
    list.appendChild(node);
  }

  renderPaginationControls(pages);
}

function renderPaginationControls(pages) {
  let c = document.getElementById("guild-pagination");
  if (!c) {
    c = document.createElement("div");
    c.id = "guild-pagination";
    c.className = "flex justify-center gap-3 mt-4";
    document.getElementById("panel").appendChild(c);
  }

  c.innerHTML = "";
  if (pages <= 1) return;

  const btn = (t, d, fn) => {
    const b = document.createElement("button");
    b.textContent = t;
    b.disabled = d;
    b.onclick = fn;
    b.className = "px-3 py-1 rounded-lg bg-white/10 disabled:opacity-40";
    return b;
  };

  c.append(
    btn("◀", currentPage === 1, () => renderGuildsPage(--currentPage)),
    document.createTextNode(` Page ${currentPage}/${pages} `),
    btn("▶", currentPage === pages, () => renderGuildsPage(++currentPage)),
  );
}

function openGuild(g, push = true) {
  console.log("[guild] open", g.id);

  if (push) {
    history.pushState({}, "", `?tab=manage-guild&id=${g.id}`);
  }

  showPanel("guild");

  document.getElementById("guild-name-header").textContent = g.name;
  document.getElementById("guild-id-header").textContent = `ID: ${g.id}`;

  const icon = document.getElementById("guild-icon");
  icon.src = g.icon ?? "/fallback-guild.png";
  extractAccentColor(icon.src).then(setAccentColor);

  const pw = localStorage.getItem("panelAuth");
  const content = document.getElementById("guild-content");
  content.textContent = "Loading…";

  fetchAPI(`/api/guild/${g.id}`, pw)
    .then((r) => r.json())
    .then((d) => {
      const tpl = document.getElementById("guild-info-template");
      const node = tpl.content.cloneNode(true);

      if (d.banner) document.getElementById("guild-banner").src = g.banner;
      else document.getElementById("guild-banner").classList.add("hidden");

      node.querySelector("[data-members]").textContent = d.count?.members ?? 0;
      node.querySelector("[data-channels]").textContent =
        d.count?.channels ?? 0;
      node.querySelector("[data-roles]").textContent = d.count?.roles ?? 0;
      node.querySelector("[data-emojis]").textContent = d.count?.emojis ?? 0;

      node.querySelector("[data-created]").textContent = d.dates?.created
        ? new Date(d.dates.created).toLocaleDateString()
        : "Unknown";

      node.querySelector("[data-joined]").textContent = d.dates?.joined
        ? new Date(d.dates.joined).toLocaleDateString()
        : "Unknown";

      node.querySelector("[data-owner-btn]").onclick = () =>
        openUserPanel(d.owner.id);

      node.querySelector("[data-leave-btn]").onclick = async () => {
        if (!confirm(`Leave ${g.name}?`)) return;
        await fetchAPI(`/api/guild/${g.id}`, pw, "DELETE");
        BotGuilds = BotGuilds.filter((x) => x.id !== g.id);
        history.replaceState({}, "", "?tab=panel");
        loadPanel();
      };

      content.innerHTML = "";
      content.appendChild(node);
    });
}

function openUserPanel(id, push = true) {
  console.log("[user] open", id);

  if (push) {
    history.pushState({}, "", `?tab=view-user&id=${id}`);
  }

  showPanel("user");

  const content = document.getElementById("user-content");
  content.textContent = "Loading…";

  const pw = localStorage.getItem("panelAuth");

  fetchAPI(`/api/user/${id}?mutualGuilds=true`, pw)
    .then((r) => r.json())
    .then((u) => {
      extractAccentColor(u.avatar).then(setAccentColor);

      document.getElementById("user-avatar").src = u.avatar;
      if (u.banner) document.getElementById("user-banner").src = u.banner;
      else document.getElementById("user-banner").classList.add("hidden");

      document.getElementById("user-id").textContent = `ID: ${u.id}`;
      document.getElementById("user-name").textContent = !u.bot
        ? `@${u.username}`
        : u.tag;

      const tpl = document.getElementById("user-info-template");
      const node = tpl.content.cloneNode(true);

      node.querySelector("[data-created]").textContent = new Date(
        u.createdTimestamp,
      ).toLocaleDateString();
      node.querySelector("[data-bot]").textContent = u.bot ? "Yes" : "No";

      node.querySelector("[data-guilds]").innerHTML = u.mutualGuilds?.length
        ? u.mutualGuilds
            .slice(0, 2)
            .map(
              (g) =>
                `<span><img style="display:inline-block;aspect-ratio:1/1;height:1em;border-radius:25%;" src="${g.icon ?? "./fallback-guild.png"}" /> ${g.name}</span>`,
            )
            .join("<br>")
        : "No Mutual Guilds";

      node.querySelector("[data-flags]").textContent = u.flags?.length
        ? u.flags.join(", ")
        : "-";

      content.innerHTML = "";
      content.appendChild(node);
    });
}

window.addEventListener("popstate", () => {
  const q = new URLSearchParams(location.search);

  if (q.get("tab") === "manage-guild") {
    const g = BotGuilds?.find((x) => x.id === q.get("id"));
    if (g) return openGuild(g, false);
  }

  if (q.get("tab") === "view-user") {
    return openUserPanel(q.get("id"), false);
  }

  loadPanel();
});

document.getElementById("guild-back-btn")?.addEventListener("click", loadPanel);
document.getElementById("user-back-btn")?.addEventListener("click", loadPanel);

window.onload = async () => {
  const pw = localStorage.getItem("panelAuth");
  if (!pw || !(await validatePassword(pw))) {
    showPanel("login");
    return;
  }

  const q = new URLSearchParams(location.search);

  if (q.get("tab") === "manage-guild") {
    await loadGuilds();
    const g = BotGuilds?.find((x) => x.id === q.get("id"));
    if (g) return openGuild(g, false);
  }

  if (q.get("tab") === "view-user") {
    return openUserPanel(q.get("id"), false);
  }

  loadPanel();
};
