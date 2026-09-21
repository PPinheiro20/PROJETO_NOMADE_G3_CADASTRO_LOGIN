const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.post("/login", UsuarioController.login);
router.get("/", UsuarioController.listarUsuarios);
router.get("/:id", UsuarioController.buscarUsuarioPorId);
router.post("/", UsuarioController.cadastrarUsuario);
router.put("/:id", UsuarioController.atualizarUsuario);
router.delete("/:id", UsuarioController.deletarUsuario);

module.exports = router;
