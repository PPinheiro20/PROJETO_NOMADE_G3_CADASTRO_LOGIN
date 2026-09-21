/* Integração do layout NÔMADE com a API do projeto. */
const NOMADE_API = window.location.protocol === "file:" ? "http://localhost:3000" : "";
const SESSION_KEY = "nomade_usuario";

const escHtml = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function nomadeApi(path, options = {}) {
  const response = await fetch(`${NOMADE_API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || "Não foi possível concluir a operação.");
  return data;
}
function jsonRequest(method, body) { return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }; }
function currentUser() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
function requireLogin() {
  if (!currentUser()) { window.location.href = "index.html"; return false; }
  return true;
}
function bindLogout() {
  document.querySelectorAll('a[href="index.html"]').forEach(a => {
    if (a.closest(".sidebar-footer")) a.addEventListener("click", () => sessionStorage.removeItem(SESSION_KEY));
  });
  const u = currentUser();
  if (u) {
    const name = document.querySelector(".topbar-user .name");
    const role = document.querySelector(".topbar-user .role");
    const avatar = document.querySelector(".topbar-user .avatar");
    if (name) name.textContent = u.nome || u.login;
    if (role) role.textContent = u.cargo || u.setor || "Usuário";
    if (avatar) avatar.textContent = (u.nome || u.login || "U").split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase();
  }
}
function showError(message) { if (typeof nomadeToast === "function") nomadeToast(message, "error"); else alert(message); }

async function loginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  if (currentUser()) { window.location.href = "dashboard.html"; return; }
  const registerLink = document.getElementById("openRegister");
  const registerForm = document.getElementById("registerForm");
  const registerModalElement = document.getElementById("registerModal");

  if (registerLink && registerForm && registerModalElement) {
    registerLink.addEventListener("click", e => {
      e.preventDefault();
      document.getElementById("registerMessage").textContent = "";
      bootstrap.Modal.getOrCreateInstance(registerModalElement).show();
    });

    registerForm.addEventListener("submit", async e => {
      e.preventDefault();
      const nome = document.getElementById("registerNome").value.trim();
      const login = document.getElementById("registerLogin").value.trim();
      const senha = document.getElementById("registerSenha").value;
      const confirmar = document.getElementById("registerConfirmar").value;
      const cargo = document.getElementById("registerCargo").value;
      const setor = document.getElementById("registerSetor").value.trim();
      const message = document.getElementById("registerMessage");
      const button = document.getElementById("registerButton");

      if (!nome || !login || !senha || !setor) {
        message.className = "small mb-3 text-danger";
        message.textContent = "Preencha todos os campos obrigatórios.";
        return;
      }
      if (senha.length < 6) {
        message.className = "small mb-3 text-danger";
        message.textContent = "A senha deve ter pelo menos 6 caracteres.";
        return;
      }
      if (senha !== confirmar) {
        message.className = "small mb-3 text-danger";
        message.textContent = "As senhas não coincidem.";
        return;
      }

      button.disabled = true;
      try {
        await nomadeApi("/usuarios", jsonRequest("POST", { nome, login, senha, cargo, setor }));
        document.getElementById("email").value = login;
        document.getElementById("senha").value = senha;
        message.className = "small mb-3 text-success";
        message.textContent = "Usuário cadastrado! Agora você já pode entrar no sistema.";
        setTimeout(() => {
          bootstrap.Modal.getOrCreateInstance(registerModalElement).hide();
          registerForm.reset();
          document.getElementById("registerSetor").value = "Estoque";
          document.getElementById("loginError").textContent = "Cadastro realizado. Clique em Entrar no sistema.";
        }, 700);
      } catch (err) {
        message.className = "small mb-3 text-danger";
        message.textContent = err.message;
      } finally {
        button.disabled = false;
      }
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const login = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const data = await nomadeApi("/usuarios/login", jsonRequest("POST", { login, senha }));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.usuario));
      if (document.getElementById("lembrar")?.checked) localStorage.setItem(SESSION_KEY, JSON.stringify(data.usuario));
      window.location.href = "dashboard.html";
    } catch (err) {
      const box = document.getElementById("loginError"); if (box) box.textContent = err.message; else showError(err.message);
      button.disabled = false;
    }
  });
}

function rowActions(id, endpoint) {
  return `<button class="btn-ghost btn-delete" data-id="${id}" data-endpoint="${endpoint}" type="button">Excluir</button>`;
}
function bindDeleteButtons(root = document) {
  root.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", async () => {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    try { await nomadeApi(`${btn.dataset.endpoint}/${btn.dataset.id}`, { method: "DELETE" }); await loadPageData(); }
    catch (e) { showError(e.message); }
  }));
}

async function loadPageData() {
  const page = location.pathname.split("/").pop();
  if (page === "dashboard.html") return renderDashboard();
  if (page === "estoque.html") return renderStock();
  if (page === "produtos.html") return renderProducts();
  if (page === "movimentacao.html") return renderMovements();
  if (page === "usuarios.html") return renderUsers();
}

async function getAll() {
  const [produtos, fornecedores, categorias, lotes, movimentacoes, usuarios] = await Promise.all([
    nomadeApi("/produtos"), nomadeApi("/fornecedores"), nomadeApi("/categorias"), nomadeApi("/lotes"), nomadeApi("/movimentacoes-estoque"), nomadeApi("/usuarios")
  ]);
  return { produtos, fornecedores, categorias, lotes, movimentacoes, usuarios };
}

async function renderDashboard() {
  try {
    const d = await getAll();
    const cards = document.querySelectorAll(".metric-card");
    if (cards[0]) cards[0].querySelector(".metric-value").textContent = d.produtos.length;
    if (cards[1]) cards[1].querySelector(".metric-value").textContent = d.lotes.reduce((s,l)=>s + Number(l.quantidade_atual || 0), 0);
    if (cards[2]) cards[2].querySelector(".metric-value").textContent = d.movimentacoes.filter(m=>m.tipo === "Entrada").length;
    if (cards[3]) cards[3].querySelector(".metric-value").textContent = d.movimentacoes.filter(m=>m.tipo === "Saída").length;
    const tbody = document.querySelector(".table-app tbody");
    if (tbody) tbody.innerHTML = d.produtos.slice(0,8).map(p => `<tr><td class="cell-strong">${escHtml(p.nome)}</td><td class="cell-muted">${escHtml(p.codigo_produto)}</td><td class="cell-muted">${escHtml(p.modelo)}</td><td><span class="badge-app badge-info">${escHtml(p.cor || "Sem cor")}</span></td></tr>`).join("") || `<tr><td colspan="4" class="cell-muted">Nenhum produto cadastrado.</td></tr>`;
  } catch(e) { showError(e.message); }
}

async function renderStock() {
  try {
    const [produtos, fornecedores, lotes] = await Promise.all([nomadeApi("/produtos"), nomadeApi("/fornecedores"), nomadeApi("/lotes")]);
    const supplier = Object.fromEntries(fornecedores.map(f=>[f.id_fornecedor,f.nome]));
    const tbody = document.querySelector("#stockTable tbody");
    if (!tbody) return;
    tbody.innerHTML = produtos.map(p => {
      const lote = lotes.find(l => Number(l.id_lote) === Number(p.id_lote));
      const qtd = lote?.quantidade_atual ?? 0;
      const badge = qtd <= 10 ? "badge-warning" : "badge-success";
      return `<tr><td class="cell-strong">${escHtml(p.nome)}</td><td class="cell-muted">${escHtml(p.codigo_produto)}</td><td class="cell-muted">${escHtml(supplier[p.id_fornecedor] || "-")}</td><td class="cell-muted">${escHtml(lote?.codigo_lote || "-")}</td><td class="cell-muted">${escHtml(p.modelo || "-")}</td><td class="cell-muted">${escHtml(p.cor || "-")}</td><td><span class="badge-app ${badge}">${qtd} un.</span></td></tr>`;
    }).join("") || `<tr><td colspan="7" class="cell-muted">Nenhum produto cadastrado.</td></tr>`;
    nomadeInitTableFilter("filterInput", "#stockTable");
  } catch(e) { showError(e.message); }
}

async function renderProducts() {
  try {
    const [produtos, fornecedores, categorias, lotes] = await Promise.all([nomadeApi("/produtos"), nomadeApi("/fornecedores"), nomadeApi("/categorias"), nomadeApi("/lotes")]);
    const supplier = Object.fromEntries(fornecedores.map(f=>[f.id_fornecedor,f.nome]));
    const tbody = document.querySelector("#catalogTable tbody");
    if (tbody) tbody.innerHTML = produtos.map(p => { const lote=lotes.find(l=>Number(l.id_lote)===Number(p.id_lote)); return `<tr><td class="cell-strong">${escHtml(p.nome)}</td><td class="cell-muted">${escHtml(lote?.codigo_lote || "-")}</td><td class="cell-muted">${escHtml(supplier[p.id_fornecedor] || "-")}</td><td class="cell-muted">${escHtml(p.data_validade || "-")}</td><td class="cell-muted">${escHtml(p.imagem || "-")}</td><td>${rowActions(p.id_produto,"/produtos")}</td></tr>`; }).join("") || `<tr><td colspan="6" class="cell-muted">Nenhum produto cadastrado.</td></tr>`;
    nomadeInitTableFilter("catalogFilter", "#catalogTable");
    const supplierInput = document.getElementById("pFornecedor");
    if (supplierInput && supplierInput.tagName === "INPUT") {
      const select = document.createElement("select"); select.id="pFornecedor"; select.className="form-select-app"; select.required=true; select.innerHTML=`<option value="">Selecione o fornecedor</option>`+fornecedores.map(f=>`<option value="${f.id_fornecedor}">${escHtml(f.nome)}</option>`).join(""); supplierInput.replaceWith(select);
    }
    let cat = document.getElementById("pCategoria");
    if (!cat) { const col=document.createElement("div"); col.className="col-md-6"; col.innerHTML=`<label class="field-label" for="pCategoria">Categoria</label><select class="form-select-app" id="pCategoria" required><option value="">Selecione</option>${categorias.map(c=>`<option value="${c.id_categoria}">${escHtml(c.nome_categoria)}</option>`).join("")}</select>`; document.getElementById("pFornecedor").closest(".col-md-6").after(col); }
    let loteSel=document.getElementById("pLote");
    if (!loteSel) { const col=document.createElement("div"); col.className="col-md-6"; col.innerHTML=`<label class="field-label" for="pLote">Lote</label><select class="form-select-app" id="pLote" required><option value="">Selecione</option>${lotes.map(l=>`<option value="${l.id_lote}">${escHtml(l.codigo_lote || `Lote ${l.id_lote}`)}</option>`).join("")}</select>`; document.getElementById("pFornecedor").closest(".col-md-6").after(col); }
    bindProductForm(); bindDeleteButtons();
  } catch(e) { showError(e.message); }
}
let productBound = false;
function bindProductForm() {
  const form = document.getElementById("productForm"); if (!form || productBound) return; productBound=true;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    try {
      const body={id_fornecedor:Number(document.getElementById("pFornecedor").value),id_categoria:Number(document.getElementById("pCategoria").value),id_lote:Number(document.getElementById("pLote").value),nome:document.getElementById("pNome").value,descricao:document.getElementById("pDescricao").value,modelo:document.getElementById("pModelo").value,data_validade:document.getElementById("pValidade").value||null,codigo_produto:document.getElementById("pCodigo").value,cor:document.getElementById("pCor").value};
      await nomadeApi("/produtos", jsonRequest("POST", body));
      nomadeToast("Produto cadastrado com sucesso."); form.reset(); await renderProducts();
    } catch(e) { showError(e.message); }
  });
}

async function renderMovements() {
  try {
    const [movs, produtos] = await Promise.all([nomadeApi("/movimentacoes-estoque"), nomadeApi("/produtos")]);
    const productMap=Object.fromEntries(produtos.map(p=>[p.id_produto,p]));
    const tbody=document.querySelector(".table-app tbody:last-child") || document.querySelector(".table-app tbody");
    if(tbody) tbody.innerHTML=movs.slice(-10).reverse().map(m=>`<tr><td class="cell-muted">${escHtml(m.data_movimentacao)}</td><td class="cell-strong">${escHtml(productMap[m.id_produto]?.codigo_produto || m.id_produto || "-")}</td><td>${m.quantidade}</td><td><span class="badge-app ${m.tipo === "Entrada" ? "badge-success" : "badge-danger"}">${escHtml(m.tipo)}</span></td></tr>`).join("") || `<tr><td colspan="4" class="cell-muted">Nenhuma movimentação registrada.</td></tr>`;
    const productInput=document.getElementById("skuInput");
    if(productInput && productInput.tagName === "INPUT") { const select=document.createElement("select"); select.id="skuInput"; select.className="form-select-app"; select.required=true; select.innerHTML=`<option value="">Selecione o produto</option>`+produtos.map(p=>`<option value="${p.id_produto}">${escHtml(p.codigo_produto || p.nome)} — ${escHtml(p.nome)}</option>`).join(""); productInput.replaceWith(select); }
    const form=document.getElementById("moveForm");
    if(form && !form.dataset.bound){form.dataset.bound="1";form.addEventListener("submit",async e=>{e.preventDefault();try{const mode=document.querySelector("#modeTabs .active")?.dataset.mode;const tipo=mode==="entrada"?"Entrada":"Saída";await nomadeApi("/movimentacoes-estoque",jsonRequest("POST",{tipo,id_produto:Number(document.getElementById("skuInput").value),data_movimentacao:new Date().toISOString().slice(0,10),quantidade:Number(document.getElementById("qtyInput").value),observacao:document.getElementById("destinoInput").value||document.getElementById("motivoSelect").value}));nomadeToast("Movimentação registrada.");form.reset();await renderMovements();}catch(err){showError(err.message)}})}
  } catch(e) { showError(e.message); }
}

async function renderUsers() {
  try {
    const users=await nomadeApi("/usuarios");
    const tbody=document.querySelector("#userTable tbody"); if(!tbody)return;
    tbody.innerHTML=users.map(u=>`<tr><td><div class="d-flex align-items-center gap-2"><div class="avatar" style="width:34px;height:34px;font-size:.72rem">${escHtml((u.nome||u.login||"U").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase())}</div><div><div class="cell-strong">${escHtml(u.nome)}</div><div class="cell-muted" style="font-size:.78rem">${escHtml(u.login)}</div></div></div></td><td><span class="badge-app badge-info">${escHtml(u.cargo || "Usuário")}</span></td><td class="cell-muted">${escHtml(u.setor || "-" )}</td><td><span class="badge-app badge-success">Ativo</span></td><td class="cell-muted">—</td><td class="text-end">${rowActions(u.id_usuario,"/usuarios")}</td></tr>`).join("") || `<tr><td colspan="6" class="cell-muted">Nenhum usuário cadastrado.</td></tr>`;
    const total=document.querySelector(".metric-card .metric-value"); if(total) total.textContent=users.length;
    const form=document.getElementById("addUserForm"); if(form && !form.dataset.bound){form.dataset.bound="1";form.addEventListener("submit",async e=>{e.preventDefault();try{await nomadeApi("/usuarios",jsonRequest("POST",{nome:document.getElementById("uNome").value,login:document.getElementById("uEmail").value,senha:document.getElementById("uSenha")?.value || "123456",cargo:document.getElementById("uFuncao").value,setor:"Estoque"}));bootstrap.Modal.getInstance(document.getElementById("addUserModal"))?.hide();nomadeToast("Usuário adicionado com sucesso.");form.reset();await renderUsers();}catch(err){showError(err.message)}})}
    bindDeleteButtons();
  } catch(e) { showError(e.message); }
}

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.endsWith("/index.html") || location.pathname.endsWith("/")) return loginPage();
  if (!requireLogin()) return;
  bindLogout();
  loadPageData();
});
