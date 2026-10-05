const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.post("/login", UsuarioController.login);
router.get("/", UsuarioController.listarUsuarios);
router.post("/", UsuarioController.cadastrarUsuario);

// Alteração de senha precisa ficar disponível na API antes das rotas genéricas por id.
router.put("/:id/senha", UsuarioController.alterarSenha);

router.get("/:id", UsuarioController.buscarUsuarioPorId);
router.put("/:id", UsuarioController.atualizarUsuario);
router.delete("/:id", UsuarioController.deletarUsuario);

module.exports = router;
