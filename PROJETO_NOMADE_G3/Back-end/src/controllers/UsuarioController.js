const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
  async login(req, res) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Login e senha são obrigatórios.",
        });
      }

      const resultado = await UsuarioService.autenticarUsuario(login, senha);
      return res.json(resultado);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async listarUsuarios(req, res) {
    try {
      return res.json(await UsuarioService.listarUsuarios());
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async buscarUsuarioPorId(req, res) {
    try {
      return res.json(await UsuarioService.buscarUsuario(req.params.id));
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async cadastrarUsuario(req, res) {
    try {
      const { nome, login, senha, cargo, setor } = req.body;
      const resultado = await UsuarioService.criarUsuario(nome, login, senha, cargo, setor);
      return res.status(201).json(resultado);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async alterarSenha(req, res) {
    try {
      const { senhaAtual, novaSenha, confirmarSenha } = req.body;

      const resultado = await UsuarioService.alterarSenha(
        req.params.id,
        senhaAtual,
        novaSenha,
        confirmarSenha,
      );

      return res.json(resultado);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async atualizarUsuario(req, res) {
    try {
      const { nome, login, senha, cargo, setor } = req.body;
      const resultado = await UsuarioService.atualizarUsuario(
        req.params.id,
        nome,
        login,
        senha,
        cargo,
        setor,
      );
      return res.json(resultado);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }

  async deletarUsuario(req, res) {
    try {
      return res.json(await UsuarioService.excluirUsuario(req.params.id));
    } catch (erro) {
      return res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || erro.message || "Erro interno do servidor",
      });
    }
  }
}

module.exports = new UsuarioController();
