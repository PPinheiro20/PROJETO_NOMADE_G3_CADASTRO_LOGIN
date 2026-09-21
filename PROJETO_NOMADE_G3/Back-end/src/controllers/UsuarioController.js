const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
  async login(req, res) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Login e senha são obrigatórios." });
      }

      const resultado = await UsuarioService.autenticarUsuario(login, senha);
      return res.json(resultado);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
      });
    }
  }

  async listarUsuarios(req, res) {
    try { res.json(await UsuarioService.listarUsuarios()); }
    catch (erro) { res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno do servidor" }); }
  }

  async buscarUsuarioPorId(req, res) {
    try { res.json(await UsuarioService.buscarUsuario(req.params.id)); }
    catch (erro) { res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno do servidor" }); }
  }

  async cadastrarUsuario(req, res) {
    try {
      const resultado = await UsuarioService.criarUsuario(req.body.nome, req.body.login, req.body.senha, req.body.cargo, req.body.setor);
      res.status(201).json(resultado);
    } catch (erro) { res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno do servidor" }); }
  }

  async atualizarUsuario(req, res) {
    try {
      const resultado = await UsuarioService.atualizarUsuario(req.params.id, req.body.nome, req.body.login, req.body.senha, req.body.cargo, req.body.setor);
      res.json(resultado);
    } catch (erro) { res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno do servidor" }); }
  }

  async deletarUsuario(req, res) {
    try { res.json(await UsuarioService.excluirUsuario(req.params.id)); }
    catch (erro) { res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno do servidor" }); }
  }
}

module.exports = new UsuarioController();
