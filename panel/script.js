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
// On load
// =====================
window.onload = async () => {
  const login = document.getElementById("password-screen");
  const panel = document.getElementById("panel");

  show(login);

  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  const valid = await validatePassword(pw);
  if (valid) {
    hide(login);
    setTimeout(() => show(panel), 120);
  } else {
    localStorage.removeItem("panelAuth");
  }
};
