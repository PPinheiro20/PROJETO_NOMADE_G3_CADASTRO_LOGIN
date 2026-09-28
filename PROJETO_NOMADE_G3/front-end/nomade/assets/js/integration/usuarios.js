/* NÔMADE — usuarios.js */

function userRowInitials(user) {
  return (user.nome || user.login || "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function bindUserForm() {
  const form = document.getElementById("addUserForm");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nome = document.getElementById("uNome").value.trim();
    const login = document.getElementById("uEmail").value.trim();
    const senha = document.getElementById("uSenha").value;
    const cargo = document.getElementById("uFuncao").value;

    if (senha.length < 6) {
      showError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      await nomadeApi("/usuarios", jsonRequest("POST", { nome, login, senha, cargo, setor: "Estoque" }));
      bootstrap.Modal.getOrCreateInstance(document.getElementById("addUserModal")).hide();
      nomadeToast("Usuário adicionado com sucesso.");
      form.reset();
      await renderUsers();
    } catch (error) {
      showError(error.message);
    }
  });
}

async function renderUsers() {
  try {
    const users = await nomadeApi("/usuarios");
    const tbody = document.querySelector("#userTable tbody");

    if (tbody) {
      tbody.innerHTML = users.map((user) => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="avatar" style="width:34px;height:34px;font-size:.72rem">${escHtml(userRowInitials(user))}</div>
              <div>
                <div class="cell-strong">${escHtml(user.nome || "-")}</div>
                <div class="cell-muted" style="font-size:.78rem">${escHtml(user.login || "-")}</div>
              </div>
            </div>
          </td>
          <td><span class="badge-app badge-info">${escHtml(user.cargo || "Usuário")}</span></td>
          <td class="cell-muted">${escHtml(user.setor || "-")}</td>
          <td><span class="badge-app badge-success">Ativo</span></td>
          <td class="cell-muted">—</td>
          <td class="text-end">${rowActions(user.id_usuario, "/usuarios")}</td>
        </tr>`).join("") || `<tr><td colspan="6" class="cell-muted text-center">Nenhum usuário cadastrado.</td></tr>`;
    }

    const metrics = document.querySelectorAll(".metric-card .metric-value");
    if (metrics[0]) metrics[0].textContent = users.length;
    if (metrics[1]) metrics[1].textContent = users.length;

    bindUserForm();
    bindDeleteButtons(document, renderUsers);
  } catch (error) {
    showError(error.message);
  }
}

if (nomadeInitInternalPage("usuarios", "Pesquisar membros da equipe...")) {
  nomadeInitTableFilter("userFilter", "#userTable");
  renderUsers();
}
