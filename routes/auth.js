// Rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

// Crea un usuario
// api/auth
router.post(
  "/",
  // Reglas de validación
  [
    check("email", "Añade un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 6 cracteres").isLength({
      min: 6,
    }),
  ],
  authController.autenticarUsuario
);

module.exports = router;
