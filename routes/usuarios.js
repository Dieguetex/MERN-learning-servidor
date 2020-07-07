// Rutas para crear usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

// Crea un usuario
// api/usuarios
router.post(
  "/",
  // Reglas de validación
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Añade un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 6 cracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.crearUsuario
);

module.exports = router;
