/* =========================================================
   NÔMADE — layout.js
   Monta a sidebar e a topbar em todas as páginas internas,
   a partir de um único ponto de manutenção.
   ========================================================= */

const NOMADE_ICONS = {
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>`,

  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>`,
  
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H5.2"/></svg>`,
  
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.6-3.6 3.2-5.8 6.5-5.8s5.9 2.2 6.5 5.8"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M16 14.4c2.6.4 4.4 2.3 4.9 5.1"/></svg>`,
  
  doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2.5h8l4 4V21a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z"/><path d="M14 2.5V7h4"/><path d="M8 12h8M8 15.5h8M8 8.5h3"/></svg>`,
  
  gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.2a7.6 7.6 0 0 0 0-2.4l2-1.5-2-3.5-2.4.6a7.7 7.7 0 0 0-2-1.2L14.5 3h-5l-.5 2.2a7.7 7.7 0 0 0-2 1.2l-2.4-.6-2 3.5 2 1.5a7.6 7.6 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-.6c.6.5 1.3.9 2 1.2L9.5 21h5l.5-2.2c.7-.3 1.4-.7 2-1.2l2.4.6 2-3.5z"/></svg>`,
  
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.2"/><path d="M9.2 9.3a2.8 2.8 0 1 1 3.9 2.6c-.9.4-1.4 1-1.4 2.1"/><path d="M12 17.3h.01"/></svg>`,
  
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`,
  
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.3-4.3"/></svg>`,
  
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2.1 2.1 0 0 0 4 0"/></svg>`,
  
  wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.5 9.8a12 12 0 0 1 15 0"/><path d="M7.6 13.2a7.6 7.6 0 0 1 8.8 0"/><path d="M10.7 16.6a3.4 3.4 0 0 1 2.6 0"/><path d="M12 19.5h.01"/></svg>`,
  
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/></svg>`,
  
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 5l14 14M19 5L5 19"/></svg>`,
  
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M12 5v14M5 12h14"/></svg>`,
  
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16l-6.2 7.2V19l-3.6 2v-8.8z"/></svg>`,
  
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01"/></svg>`,
  
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`,
  
  arrowDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M6 13l6 6 6-6"/></svg>`,
  
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>`,
  
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12.5l5 5L20 6"/></svg>`,
  
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3M3 12h18"/></svg>`,
  
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3.5" width="18" height="17" rx="2"/><circle cx="8.5" cy="9" r="1.6"/><path d="M21 16l-5.5-5.5L8 18"/></svg>`,
};

const NOMADE_NAV = [
  { key: "dashboard", href: "dashboard.html", label: "Painel de Controle", icon: "grid" },
  { key: "estoque", href: "estoque.html", label: "Inventário", icon: "box" },
  { key: "produtos", href: "produtos.html", label: "Produtos", icon: "cart" },
  { key: "movimentacao", href: "movimentacao.html", label: "Entrada &amp; Saída", icon: "scan" },
  { key: "usuarios", href: "usuarios.html", label: "Usuários", icon: "users" },
  { key: "relatorios", href: "relatorios.html", label: "Relatórios", icon: "doc" },
  { key: "configuracoes", href: "configuracoes.html", label: "Configurações", icon: "gear" },
];

function nomadeBrandMark() {
  return `<svg class="brand-mark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21.5c5-1.5 9-4.6 11.3-9.3 1-2 3-6.7 5.2-8.7-2.7 3.8-3 8.4-1.2 11.7 1.4 2.6 4 4.2 7.2 3.9-3.7 2.8-8.7 3.3-12.9 1-1.7-.9-3-.9-4.7-.2-1.7.8-3.1 1.7-4.9 1.6z"/>
  </svg>`;
}

function nomadeBuildSidebar(active) {
  const links = NOMADE_NAV.map(item => `
    <a href="${item.href}" class="nav-link-app${item.key === active ? " active" : ""}">
      ${NOMADE_ICONS[item.icon]}
      <span>${item.label}</span>
    </a>`).join("");

  return `
  <aside class="sidebar" id="nomadeSidebar">
    <div class="brand">
      ${nomadeBrandMark()}
      <span>NÔMADE</span>
    </div>
    <nav class="nav-section">${links}</nav>
    <div class="sidebar-footer">
      <a href="#" class="nav-link-app">${NOMADE_ICONS.help}<span>Suporte</span></a>
      <a href="index.html" class="nav-link-app">${NOMADE_ICONS.logout}<span>Sair</span></a>
      <div class="sidebar-version">Nômade v2.4.0</div>
    </div>
  </aside>`;
}

function nomadeBuildTopbar(opts) {
  const placeholder = (opts && opts.searchPlaceholder) || "Buscar no sistema...";
  return `
  <header class="topbar">
    <button class="icon-btn sidebar-toggle" id="sidebarToggle" aria-label="Abrir menu">${NOMADE_ICONS.menu}</button>
    <div class="search-field">
      ${NOMADE_ICONS.search}
      <input type="search" placeholder="${placeholder}" id="globalSearch" autocomplete="off">
    </div>
    <span class="status-pill">
      <span class="status-dot"></span> Sistema Online
    </span>
    <div class="ms-auto d-flex align-items-center gap-2">
      <button class="icon-btn" aria-label="Notificações">${NOMADE_ICONS.bell}<span class="ping"></span></button>
      <button class="icon-btn" aria-label="Status de sincronização">${NOMADE_ICONS.wifi}</button>
      <div class="topbar-user">
        <div class="avatar">AN</div>
        <div class="user-meta">
          <div class="name">Alex Nomade</div>
          <div class="role">Chefe de Logística</div>
        </div>
      </div>
    </div>
  </header>`;
}

function nomadeMountShell(active, opts) {
  const root = document.getElementById("app-shell");
  if (!root) return;
  root.insertAdjacentHTML("afterbegin", nomadeBuildSidebar(active));
  const mainCol = document.createElement("div");
  mainCol.className = "main-col";
  mainCol.id = "mainCol";
  // move everything except sidebar into main-col
  const nodes = Array.from(root.childNodes).filter(n => n.id !== "nomadeSidebar");
  nodes.forEach(n => mainCol.appendChild(n));
  root.appendChild(mainCol);
  mainCol.insertAdjacentHTML("afterbegin", nomadeBuildTopbar(opts));

  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("nomadeSidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    sidebar.addEventListener("click", (e) => {
      if (e.target === sidebar) sidebar.classList.remove("open");
    });
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 991 && sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }
}
