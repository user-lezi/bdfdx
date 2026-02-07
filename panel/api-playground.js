let endpoints = [];

let password = localStorage.getItem("panelAuth");
if (!password) redirectToPanel();

let CurrentAccentColor;
let AccentColorCache = {};
let accentAnimationFrame = null;

function parseRGB(color) {
  return color.match(/\d+/g).map(Number);
}

function setAccentColor(color, duration = 1200) {
  if (color === CurrentAccentColor) return;

  const start = parseRGB(CurrentAccentColor ?? `88, 101, 242`);
  let end = parseRGB(color);

  let [r, g, b] = end;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  if (lum > 180) {
    const k = 180 / lum;
    end = [(r * k) | 0, (g * k) | 0, (b * k) | 0];
  }

  const startTime = performance.now();

  if (accentAnimationFrame) cancelAnimationFrame(accentAnimationFrame);

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);

    const eased = 1 - Math.pow(1 - t, 3);

    const current = start.map((s, i) => Math.round(s + (end[i] - s) * eased));

    document.documentElement.style.setProperty(
      "--accent-rgb",
      current.join(", "),
    );

    if (t < 1) {
      accentAnimationFrame = requestAnimationFrame(animate);
    } else {
      CurrentAccentColor = `rgb(${end.join(",")})`;
      localStorage.setItem("accent", CurrentAccentColor);
      console.log("[accent]", ...end);
    }
  }

  accentAnimationFrame = requestAnimationFrame(animate);
}

const listSection = document.getElementById("endpoint-list");
const listEl = listSection.querySelector("div");
const viewEndpointSection = document.getElementById("endpoint-view");

/* ---------- list ---------- */
function renderEndpoints() {
  let deltaTime = 100;
  let i = 0;
  for (const ep of endpoints) {
    const btn = document.createElement("button");
    btn.className = `
    opacity-0 w-full text-left p-4 rounded-xl
    bg-black/40 border border-white/12
    hover:bg-black/60 hover:border-[rgba(var(--accent-rgb),0.4)]
    transition
  `;
    btn.innerHTML = `
    <div class="text-xs text-white/50">${ep.method.toUpperCase()}</div>
    <div class="font-mono text-sm">${ep.path}</div>
    <div class="text-xs text-white/60">${ep.summary}</div>
  `;
    btn.onclick = () => openEndpoint(ep);
    listEl.appendChild(btn);
    setTimeout(
      () => {
        btn.classList.remove("opacity-0");
      },
      500 + i * deltaTime,
    );
    i++;
  }
}

/* ---------- open endpoint ---------- */
function openEndpoint(ep) {
  let requestBody = null;
  listSection.classList.add("hidden");
  viewEndpointSection.classList.remove("hidden");

  const tpl = document.getElementById("opened-endpoint-template");
  const node = tpl.content.cloneNode(true);

  const path = "/api" + ep.path;

  node.getElementById("summary").textContent = ep.summary;
  node.getElementById("description").textContent = ep.description;

  let params = {};
  let apiquery = {};

  const updateDisplayUrl = () => {
    const url = generateUrl(path, params, apiquery);
    (
      node.getElementById("display-url") ??
      document.getElementById("display-url") ??
      {}
    ).value = url;
  };
  if ("params" in ep) {
    const paramform = node.getElementById("params-form");

    for (const [key, value] of Object.entries(ep.params)) {
      let label = document.createElement("label");
      label.className =
        "block font-mono mb-2.5 text-sm font-medium text-heading";
      label.textContent = ":" + key;

      let input = document.createElement("input");
      input.type = "text";
      input.dataset.key = key;
      input.placeholder = value.example ?? "";

      input.className = `
        bg-black/30 text-white/90
        border border-white/20
        focus:border-[rgb(var(--accent-rgb))]
        focus:ring-1 focus:ring-[rgb(var(--accent-rgb))]/30
        appearance-none
        rounded-md block w-full
        px-3 py-2.5
      `;

      input.addEventListener("input", (e) => {
        params[key] = e.target.value;
        updateDisplayUrl();
      });

      let helperText = document.createElement("p");
      helperText.textContent = value.description;
      helperText.className = "mt-2.5 text-sm text-body";

      let inputDiv = document.createElement("div");
      inputDiv.className = "mb-2";
      inputDiv.appendChild(label);
      inputDiv.appendChild(input);
      inputDiv.appendChild(helperText);

      paramform.appendChild(inputDiv);
    }

    paramform.classList.remove("hidden");
  }

  if ("query" in ep) {
    const queryform = node.getElementById("query-form");

    for (const [key, value] of Object.entries(ep.query)) {
      let label = document.createElement("label");
      label.className =
        "block font-mono mb-2.5 text-sm font-medium text-heading";
      label.textContent = key;

      let input = document.createElement("input");
      input.type = value.type == "number" ? "number" : "text";
      input.dataset.key = key;
      input.placeholder = value.example ?? "";

      input.className = `
        bg-black/30 text-white/90
        border border-white/20
        focus:border-[rgb(var(--accent-rgb))]
        focus:ring-1 focus:ring-[rgb(var(--accent-rgb))]/30
        appearance-none
        rounded-md block w-full
        px-3 py-2.5
      `;

      input.addEventListener("input", (e) => {
        apiquery[key] = e.target.value;
        updateDisplayUrl();
      });

      let helperText = document.createElement("p");
      helperText.textContent = value.description;
      helperText.className = "mt-2.5 text-sm text-body";

      let inputDiv = document.createElement("div");
      inputDiv.className = "mb-2";
      inputDiv.appendChild(label);
      inputDiv.appendChild(input);
      inputDiv.appendChild(helperText);

      queryform.appendChild(inputDiv);
    }

    queryform.classList.remove("hidden");
  }

  if ("body" in ep) {
    const bodyForm = node.getElementById("body-form");

    let textarea = document.createElement("textarea");
    textarea.rows = 10;

    textarea.className = `
    bg-black/30 text-white/90
    border border-white/20
    focus:border-[rgb(var(--accent-rgb))]
    focus:ring-1 focus:ring-[rgb(var(--accent-rgb))]/30
    appearance-none
    rounded-md block w-full
    px-3 py-2.5
    font-mono text-sm
  `;

    let placeholderJSON = {};
    for (const [key, value] of Object.entries(ep.body)) {
      placeholderJSON[key] = value.example;
    }
    textarea.placeholder = JSON.stringify(placeholderJSON, null, 2);

    let helperText = document.createElement("p");
    helperText.textContent = ep.body.description ?? "Request payload (JSON)";
    helperText.className = "mt-2.5 text-sm text-body";

    let errorText = document.createElement("p");
    errorText.className = "mt-2 text-sm text-red-400 hidden";

    textarea.addEventListener("input", () => {
      try {
        requestBody = textarea.value ? JSON.parse(textarea.value) : null;
        textarea.classList.remove("border-red-400");
        errorText.classList.add("hidden");
      } catch (err) {
        requestBody = null;
        textarea.classList.add("border-red-400");
        errorText.textContent = "Invalid JSON";
        errorText.classList.remove("hidden");
      }
    });

    let bodyDiv = document.createElement("div");
    bodyDiv.className = "mb-4";
    bodyDiv.appendChild(textarea);
    bodyDiv.appendChild(helperText);
    bodyDiv.appendChild(errorText);

    bodyForm.appendChild(bodyDiv);
    bodyForm.classList.remove("hidden");
  }

  updateDisplayUrl();

  node.getElementById("copy-url-btn").onclick = () =>
    navigator.clipboard.writeText(generateUrl(path, params, apiquery));

  node.getElementById("endpoint-back-btn").onclick = () => {
    listSection.classList.remove("hidden");
    viewEndpointSection.classList.add("hidden");
    viewEndpointSection.innerHTML = "";
  };

  // endpoint runner

  const btn = node.getElementById("make-request-btn");
  const outputBox = node.getElementById("response-box");
  const output = node.getElementById("response-output");
  btn.onclick = async () => {
    const url = generateUrl(path, params, apiquery);

    btn.disabled = true;
    btn.textContent = "Sending...";
    outputBox.classList.add("hidden");

    try {
      const res = await fetch(url, {
        method: ep.method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          password,
        },
        body:
          ep.method !== "GET" &&
          typeof requestBody == "object" &&
          requestBody !== null
            ? JSON.stringify(requestBody)
            : undefined,
      });

      let text;
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        text = JSON.stringify(await res.json(), null, 2);
      } else {
        text = await res.text();
      }

      output.textContent = `Status: ${res.status} ${res.statusText}\n\n` + text;

      outputBox.classList.remove("hidden");
    } catch (err) {
      output.textContent = `Request failed:\n\n${err.message}`;
      outputBox.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Request";
    }
  };

  viewEndpointSection.appendChild(node);
}

function generateUrl(base, params = {}, apiquery = {}) {
  for (const [key, value] of Object.entries(params)) {
    base = base.replace(`/:${key}`, "/" + value);
  }
  let q = new URLSearchParams();
  for (const [key, value] of Object.entries(apiquery)) {
    if (value) q.append(key, value);
  }
  if (q.size) base += `?${q.toString()}`;
  return base;
}

function redirectToPanel() {
  location.href = "/";
}
window.onload = async () => {
  let accent = localStorage.getItem("accent");
  if (accent) setAccentColor(accent, 800);
  await fetch("/api/endpoints", {
    headers: { password, "Content-Type": "application/json" },
    method: "GET",
  })
    .then((r) => {
      if (!r.ok) return redirectToPanel();
      return r.json();
    })
    .then(async (e) => {
      endpoints = Object.values(e);
      await renderEndpoints();
    })
    .catch(redirectToPanel);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
