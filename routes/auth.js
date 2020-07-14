// Rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");

// Iniciar sesión
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

// Obtiene el usuario autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
