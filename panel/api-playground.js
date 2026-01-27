let endpoints = [];

let password = localStorage.getItem("panelAuth");
if (!password) redirectToPanel();

const listEl = document.getElementById("endpoint-list");
const viewEl = document.getElementById("endpoint-view");

/* ---------- sidebar ---------- */
function renderEndpoints() {
  endpoints.forEach((ep) => {
    const btn = document.createElement("button");
    btn.className = `
    w-full text-left p-4 rounded-xl
    bg-black/40 border border-white/10
    hover:bg-black/60 hover:border-[rgba(var(--accent-rgb),0.4)]
    transition
  `;
    btn.innerHTML = `
    <div class="text-xs text-white/50">${ep.method}</div>
    <div class="font-mono text-sm">${ep.path}</div>
    <div class="text-xs text-white/60">${ep.summary}</div>
  `;
    btn.onclick = () => openEndpoint(ep);
    listEl.appendChild(btn);
  });
}

/* ---------- endpoint view ---------- */

function openEndpoint(ep) {
  viewEl.classList.remove("hidden");

  let url = "/api" + ep.path;
  function quotesc(s) {
    return s.replaceAll("'", "\'");
  }
  viewEl.innerHTML = `
    <div class="space-y-6">

      <div>
        <h2 class="text-xl font-semibold">${ep.summary}</h2>
        <p class="text-white/60 text-sm">${ep.description}</p>
      </div>
      <hr>
      <!-- Params -->
      <div class="space-y-3">
        ${"params" in ep ? "<p>URL Parameters</p>" : ""} 
        ${Object.entries(ep.params || {})
          .map(
            ([name, p]) => `
          <div>
            <label class="text-xs text-white/50">${name.toLocaleUpperCase()}</label>
            <input
              data-param="${name}"
              placeholder='${quotesc(p.example) || ""}'
              class="
                w-full rounded-xl px-4 py-2.5
                bg-black/40 border border-white/15
                text-sm font-mono
                focus:outline-none
                focus:border-[rgba(var(--accent-rgb),0.7)]
              "
            />
          </div>
        `,
          )
          .join("")}
      </div>
      <!-- Query -->
      <div class="space-y-3">
        ${"query" in ep ? "<p>URL Query</p>" : ""} 
        ${Object.entries(ep.query || {})
          .map(
            ([name, p]) => `
          <div>
            <label class="text-xs text-white/50">${name.toLocaleUpperCase()}</label>
            <input
              data-query="${name}"
              placeholder='${quotesc(p.example) || ""}'
              class="
                w-full rounded-xl px-4 py-2.5
                bg-black/40 border border-white/15
                text-sm font-mono
                focus:outline-none
                focus:border-[rgba(var(--accent-rgb),0.7)]
              "
            />
          </div>
        `,
          )
          .join("")}
      </div>
      <!-- Body -->
      <div class="space-y-3">
        ${"body" in ep ? "<p>URL Body</p>" : ""} 
        ${Object.entries(ep.body || {})
          .map(
            ([name, p]) => `
          <div>
            <label class="text-xs text-white/50">${name.toLocaleUpperCase()}</label>
            <input
              data-body="${name}"
              placeholder='${quotesc(typeof p.example == "object" ? JSON.stringify(p.example) : p.example) || ""}'
              class="
                w-full rounded-xl px-4 py-2.5
                bg-black/40 border border-white/15
                text-sm font-mono
                focus:outline-none
                focus:border-[rgba(var(--accent-rgb),0.7)]
              "
            />
          </div>
        `,
          )
          .join("")}
      </div>

      <!-- URL preview -->
      <div
        id="url-preview"
        class="px-4 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-sm break-all"
      >
        ${url}
      </div>
      
      <!-- Actions -->
      <div class="flex gap-2">
        <button
          id="try-btn"
          class="bg-[rgb(var(--accent-rgb))] text-black font-medium rounded-xl px-4 py-2 hover:brightness-110 transition"
        >
          Try
        </button>
      </div>
      <hr>
      <!-- Response -->
      <div
        id="response"
        class="hidden bg-black/60 border border-white/10 rounded-2xl p-4"
      >
      <div class="flex gap-2">
        <span
        id="res-status"
          class="bg-[rgb(var(--accent-rgb))] font-medium rounded-xl px-4 py-2 hover:brightness-110 transition"
        >
          Status: X
        </span>
        <span
        id="res-time"
          class="bg-[rgb(var(--accent-rgb))] font-medium rounded-xl px-4 py-2 hover:brightness-110 transition"
        >
          -1ms
        </span>
      </div>
        <pre class="text-sm font-mono whitespace-pre-wrap"></pre>
      </div>

    </div>
  `;

  const preview = viewEl.querySelector("#url-preview");
  const Pinputs = viewEl.querySelectorAll("input[data-param]") || [];
  const Qinputs = viewEl.querySelectorAll("input[data-query]") || [];
  const responseBox = viewEl.querySelector("#response");
  const pre = responseBox.querySelector("pre");
  const resTime = responseBox.querySelector("#res-time");
  const resStatus = responseBox.querySelector("#res-status");

  function generateUrl() {
    let newUrl = "/api" + ep.path;
    Pinputs.forEach((i) => {
      newUrl = newUrl.replace(
        `:${i.dataset.param}`,
        i.value || `:${i.dataset.param}`,
      );
    });
    let q = new URLSearchParams();
    Qinputs.forEach((i) => {
      if (i.value) q.set(i.dataset.query, i.value);
    });
    if (q.size) newUrl = newUrl + "?" + q.toString();
    return newUrl;
  }
  [...Pinputs, ...Qinputs].forEach((input) => {
    input.addEventListener("input", () => {
      let newUrl = generateUrl();
      preview.textContent = newUrl;
    });
  });

  /* Try */
  viewEl.querySelector("#try-btn").onclick = async () => {
    let result = {};
    let start = performance.now();
    let res = await fetch(generateUrl(), {
      headers: { password, "Content-Type": "application/json" },
      method: ep.method.toUpperCase(),
    });
    try {
      result.data = await res.json().catch(() => res.text());
    } catch (e) {
      result.data = e;
    }
    result.status = res.status;
    result.time = performance.now() - start;
    console.log(`Made an request:`, result, res);
    pre.textContent =
      "object" == typeof result.data
        ? JSON.stringify(result.data, null, 2)
        : result.data;
    resTime.textContent = result.time.toFixed(2) + " ms";
    resStatus.textContent = `Status: ${result.status}`;

    responseBox.classList.remove("hidden");
  };

  /* Copy */
}

function redirectToPanel() {
  location.href = "/";
}
window.onload = async () => {
  await fetch("/api/endpoints", {
    headers: { password, "Content-Type": "application/json" },
    method: "GET",
  })
    .then((r) => {
      if (!r.ok) return redirectToPanel();
      return r.json();
    })
    .then((e) => {
      endpoints = Object.values(e);
      renderEndpoints();
    })
    .catch(redirectToPanel);

  fetch("/api/bot", {
    headers: { password, "Content-Type": "application/json" },
    method: "GET",
  })
    .then((r) => r.json())
    .then((bot) => {
      extractAccentColor(bot.user.avatar).then(setAccentColor);
    })
    .catch(() => {});
};

function setAccentColor(color) {
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

async function extractAccentColor(src) {
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
  });
}
