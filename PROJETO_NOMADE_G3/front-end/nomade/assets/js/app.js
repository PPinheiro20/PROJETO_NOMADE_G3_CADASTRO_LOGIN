/* =========================================================
   NÔMADE — app.js
   Interações genéricas usadas em várias páginas.
   ========================================================= */

function nomadeToast(message, tone = "success") {
  let el = document.getElementById("nomadeToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "nomadeToast";
    el.className = "toast-app";
    document.body.appendChild(el);
  }
  const icon = tone === "success" ? NOMADE_ICONS.check : NOMADE_ICONS.spark;
  el.innerHTML = `${icon}<span>${message}</span>`;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2600);
}

/* Stepper de quantidade (Entrada/Saída de mercadoria) */
function nomadeInitSteppers() {
  document.querySelectorAll("[data-stepper]").forEach(wrap => {
    const input = wrap.querySelector("input");
    const min = parseInt(input.min || "0", 10);
    wrap.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        let val = parseInt(input.value || "0", 10);
        val = btn.dataset.dir === "up" ? val + 1 : Math.max(min, val - 1);
        input.value = val;
        input.dispatchEvent(new Event("change"));
      });
    });
  });
}

/* Filtro simples de tabela por texto */
function nomadeInitTableFilter(inputId, tableSelector) {
  const input = document.getElementById(inputId);
  const table = document.querySelector(tableSelector);
  if (!input || !table) return;
  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    table.querySelectorAll("tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });
}

/* Abas tipo pill (Todos / Novidades / Arquivo) */
function nomadeInitPillTabs() {
  document.querySelectorAll(".pill-tabs").forEach(group => {
    group.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
}

/* Gráfico de barras em CSS a partir de um array de {label, value} */
function nomadeRenderBarChart(containerId, data) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...data.map(d => d.value));
  const peakIndex = data.findIndex(d => d.value === max);
  el.innerHTML = data.map((d, i) => `
    <div class="bar-col${i === peakIndex ? " is-peak" : ""}">
      <div class="bar" style="height:${Math.max(6, (d.value / max) * 100)}%"></div>
      <div class="bar-label">${d.label}</div>
    </div>`).join("");
}

/* Donut em CSS conic-gradient a partir de [{label, value, color}] */
function nomadeRenderDonut(wrapId, centerValue, centerLabel, segments) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const stops = segments.map(seg => {
    const start = (acc / total) * 360;
    acc += seg.value;
    const end = (acc / total) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  }).join(", ");
  wrap.innerHTML = `
    <div class="donut" style="--donut-gradient: ${stops}">
      <div class="donut-center">
        <div class="value">${centerValue}</div>
        <div class="label">${centerLabel}</div>
      </div>
    </div>`;
}

/* Bloqueia envio de formulário de demonstração e mostra toast */
function nomadeBindDemoForm(formId, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    nomadeToast(message || "Salvo com sucesso.");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  nomadeInitSteppers();
  nomadeInitPillTabs();
});
