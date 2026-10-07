 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// auth.routes.js
// -----------------------------------------------------------------
// Routes pour l'authentification.
// =====================================================================

const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const { validate, registerSchema, loginSchema, refreshSchema, logoutSchema } = require("./auth.validator");

// Middleware d'authentification JWT (protege les routes)
const { authenticate } = require("../../middleware/auth.middleware");

// POST /api/auth/register
// Inscription — pas de token requis
router.post("/register",
    validate(registerSchema),
    authController.register
);

// POST /api/auth/login
// Connexion — pas de token requis
router.post("/login",
    validate(loginSchema),
    authController.login
);

// GET /api/auth/me
// Profil utilisateur connecte — token requis
// authenticate verifie le JWT avant d'arriver au controller
router.get("/me",
    authenticate,
    authController.getMe
);

// POST /api/auth/refresh
// Rafraichir le token — pas de token d'acces requis
router.post("/refresh",
    validate(refreshSchema),
    authController.refreshToken
);

// POST /api/auth/logout
// Deconnexion — token requis
// Le refreshToken fourni dans le body est rejete (JWT blacklist)
router.post("/logout",
    authenticate,
    validate(logoutSchema),
    authController.logout
);

module.exports = router;
