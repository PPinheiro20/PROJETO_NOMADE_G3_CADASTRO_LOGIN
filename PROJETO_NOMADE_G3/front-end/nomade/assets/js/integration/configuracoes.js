/* =========================================================
   NÔMADE — configuracoes.js
   Perfil, tema, preferências locais e encerramento da sessão.
   Requer: theme.js + core.js
   ========================================================= */

function fillProfileSettings() {
  const user = currentUser();
  if (!user) return;

  const nome = user.nome || user.login || "Usuário";
  const cargo = user.cargo || "Usuário";
  const setor = user.setor || "-";

  document.getElementById("profileName").textContent = nome;
  document.getElementById("profileRole").textContent = `${cargo} · ${setor}`;
  document.getElementById("cNome").value = user.nome || "";
  document.getElementById("cEmail").value = user.login || "";
  document.getElementById("cCargo").value = cargo;
  document.getElementById("cSetor").value = setor;
  document.getElementById("profileAvatar").textContent = userInitials(user);
}

function bindPreferenceSettings() {
  const darkSwitch = document.getElementById("darkSwitch");
  const notifSwitch = document.getElementById("notifSwitch");

  if (!darkSwitch || !notifSwitch) return;

  // Switch ligado = escuro. Desligado = claro.
  darkSwitch.checked = nomadeGetTheme() === "dark";
  notifSwitch.checked = localStorage.getItem("nomade_notifications") === "true";

  darkSwitch.addEventListener("change", () => {
    const theme = darkSwitch.checked ? "dark" : "light";
    nomadeSetTheme(theme);

    nomadeToast(
      theme === "dark"
        ? "Modo escuro ativado."
        : "Modo claro ativado."
    );
  });

  notifSwitch.addEventListener("change", () => {
    localStorage.setItem("nomade_notifications", String(notifSwitch.checked));
    nomadeToast("Preferência de notificações salva.");
  });

  document.getElementById("clearPreferencesButton")?.addEventListener("click", () => {
    localStorage.removeItem("nomade_notifications");
    nomadeResetTheme();

    darkSwitch.checked = true;
    notifSwitch.checked = false;

    nomadeToast("Preferências locais restauradas.");
  });
}

function bindSettingsLogout() {
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

if (nomadeInitInternalPage("configuracoes", "Pesquisar no sistema...")) {
  fillProfileSettings();
  bindPreferenceSettings();
  bindSettingsLogout();
}
