const crypto = require("crypto");
const usuarioRepository = require("../repositories/UsuarioRepository");

function senhaValida(senhaInformada, senhaBanco) {
  if (!senhaBanco) return false;

  // Aceita hashes SHA-256 para novos cadastros e mantém compatibilidade
  // com os usuários antigos que possuem senha em texto simples.
  if (String(senhaBanco).startsWith("sha256:")) {
    const hash = crypto.createHash("sha256").update(senhaInformada).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(String(senhaBanco).slice(7)));
  }

  return String(senhaInformada) === String(senhaBanco);
}

async function autenticarUsuario(login, senha) {
  const usuario = await usuarioRepository.buscarUsuarioPorLogin(login);

  if (!usuario || !senhaValida(senha, usuario.senha)) {
    const erro = new Error("Login ou senha inválidos.");
    erro.status = 401;
    erro.mensagem = erro.message;
    throw erro;
  }

  const { senha: _senha, ...usuarioSeguro } = usuario;
  return { sucesso: true, mensagem: "Login realizado com sucesso.", usuario: usuarioSeguro };
}

async function criarUsuario(nome, login, senha, cargo, setor) {
  if (!nome || !login || !senha) {
    const erro = new Error("Nome, login e senha são obrigatórios.");
    erro.status = 400;
    erro.mensagem = erro.message;
    throw erro;
  }

  if (String(senha).length < 6) {
    const erro = new Error("A senha deve ter pelo menos 6 caracteres.");
    erro.status = 400;
    erro.mensagem = erro.message;
    throw erro;
  }

  const senhaHash = "sha256:" + crypto.createHash("sha256").update(String(senha)).digest("hex");
  const dadosDoUsuario = { nome, login, senha: senhaHash, cargo, setor };

  try {
    return await usuarioRepository.cadastrarUsuario(dadosDoUsuario);
  } catch (erroBanco) {
    if (erroBanco.code === "ER_DUP_ENTRY") {
      const erro = new Error("Este login já está cadastrado. Escolha outro login.");
      erro.status = 409;
      erro.mensagem = erro.message;
      throw erro;
    }
    throw erroBanco;
  }
}

async function listarUsuarios() { return usuarioRepository.listarUsuarios(); }
async function buscarUsuario(id) { return usuarioRepository.buscarUsuarioId(id); }

async function atualizarUsuario(id, nome, login, senha, cargo, setor) {
  const dadosDoUsuario = { nome, login, senha, cargo, setor };
  return usuarioRepository.atualizarUsuario(id, dadosDoUsuario);
}

async function excluirUsuario(id) { return usuarioRepository.apagarUsuario(id); }

module.exports = { autenticarUsuario, criarUsuario, listarUsuarios, buscarUsuario, atualizarUsuario, excluirUsuario };
