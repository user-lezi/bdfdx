// Utility functions
const $ = (id) => document.getElementById(id);
const show = (el) => (el.style.display = "flex");
const hide = (el) => (el.style.display = "none");

// Calculate dominant color from avatar
async function extractAccentColor(imgUrl) {
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
        // sample every 50px
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      resolve(
        `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`,
      );
    };

    img.onerror = () => resolve("#5865f2"); // fallback
  });
}

// Validate password
async function validatePassword(input) {
  const pw = input ?? $("password-input").value;

  try {
    const res = await fetch(`/password?password=${pw}`);
    const data = await res.json();

    if (data.valid) {
      localStorage.setItem("panelAuth", pw);
      loadPanel();
    } else {
      $("error").style.display = "block";
    }
  } catch {
    $("error").innerText = "API Error";
    $("error").style.display = "block";
  }
}

// Load main panel
function loadPanel() {
  hide($("password-screen"));
  show($("panel"));
  fetchBotData();
}

// Fetch bot data
async function fetchBotData() {
  const pw = localStorage.getItem("panelAuth");
  if (!pw) return;

  await validatePassword(pw); // ensure valid

  try {
    const res = await fetch(`/api/bot?password=${pw}`);
    const bot = await res.json();

    // Fill UI
    $("bot-name").innerText = bot.user.tag ?? "Unknown Bot";
    $("bot-desc").innerText = bot.application.description ?? "No description";

    // Avatar + accent color
    $("bot-avatar").src = bot.user.avatar;
    const accent = await extractAccentColor(bot.user.avatar);
    document.documentElement.style.setProperty("--accent-color", accent);

    // Banner (fallback to generated)
    if (bot.user.banner) {
      $("bot-banner").src = bot.user.banner;
    } else {
      // Generate gradient banner using accent
      const banner = document.createElement("canvas");
      banner.width = 600;
      banner.height = 200;
      const ctx = banner.getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, banner.width, banner.height);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, banner.width, banner.height);

      $("bot-banner").src = banner.toDataURL();
    }

    // Invite button
    $("invite-btn").onclick = () =>
      window.open(
        `https://discord.com/oauth2/authorize?client_id=${bot.user.id}`,
        "_blank",
      );

    // Stats
    $("guilds").innerText = bot.stats.guilds ?? 0;
    $("members").innerText = bot.stats.users ?? 0;

    updateUptime(bot.stats.uptime ?? 0);
    document.title = `${bot.user.username} Panel`;
  } catch (err) {
    $("guilds").innerText = "ERR";
    $("members").innerText = "ERR";
  }
}

// Uptime formatter
function updateUptime(initial) {
  let ms = initial;

  const fmt = (ms) => {
    const s = ms / 1000;
    const m = s / 60;
    const h = m / 60;
    const d = h / 24;
    return d >= 1
      ? `${d.toFixed(1)}d`
      : h >= 1
        ? `${h.toFixed(1)}h`
        : m >= 1
          ? `${m.toFixed(1)}m`
          : `${s.toFixed(1)}s`;
  };

  setInterval(() => {
    ms += 1000;
    $("uptime").innerText = fmt(ms);
  }, 1000);
}

// On page load
window.onload = () => {
  show($("password-screen"));
  if (localStorage.getItem("panelAuth")) loadPanel();
};
