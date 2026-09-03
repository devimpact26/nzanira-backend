 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// auth.controller.js
// -----------------------------------------------------------------
// Gere les requetes HTTP pour l'authentification.
// Recois req/res, appelle le service, renvoie la reponse.
// =====================================================================

const authService = require("./auth.service");

/**
 * POST /api/auth/register
 *
 * Inscrire un nouvel utilisateur.
 * Body : { full_name, phone, password, role }
 */
async function register(req, res, next) {
    try {
        const { user, token, refreshToken } = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: "Inscription reussie",
            data: { user, token, refreshToken }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/login
 *
 * Connecter un utilisateur.
 * Body : { phone, password }
 */
async function login(req, res, next) {
    try {
        const { phone, password } = req.body;

        const { user, token, refreshToken } = await authService.login(phone, password);

        res.json({
            success: true,
            message: "Connexion reussie",
            data: { user, token, refreshToken }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/me
 *
 * Obtenir le profil de l'utilisateur connecte.
 * Necessite un token JWT valide dans le header Authorization.
 */
async function getMe(req, res, next) {
    try {
        // req.user est rempli par le middleware authenticate
        const user = await authService.getMe(req.user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/refresh
 *
 * Rafraichir un token expire.
 * Body : { refreshToken }
 */
async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;

        const tokens = await authService.refreshToken(refreshToken);

        res.json({
            success: true,
            message: "Token rafraichi",
            data: tokens
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getMe,
    refreshToken
};
