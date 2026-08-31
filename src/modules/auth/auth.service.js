 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// auth.service.js
// -----------------------------------------------------------------
// Logique metier de l'authentification :
// - Inscription (hachage du mot de passe, verification du doublon)
// - Connexion (comparaison du mot de passe, generation du token)
// - Rafraichissement du token
// =====================================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("./auth.model");

// Secret et duree de vie des tokens
// En production, JWT_SECRET doit etre dans .env
const JWT_SECRET = process.env.JWT_SECRET || "nzanapp-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const REFRESH_EXPIRES_IN = "30d";

/**
 * Inscrire un nouvel utilisateur.
 *
 * LOGIQUE :
 * 1. Verifier que le telephone n'est pas deja utilise
 * 2. Hacher le mot de passe (bcrypt)
 * 3. Creer l'utilisateur en base
 * 4. Generer un token JWT
 * 5. Renvoyer l'utilisateur + le token
 *
 * @param {Object} userData - { full_name, phone, email, password, role }
 * @returns {Object} { user, token, refreshToken }
 */
async function register(userData) {
    const { full_name, phone, email, password, role } = userData;

    // VERIFICATION : Le telephone doit etre unique
    const existingUser = await authModel.findByPhone(phone);
    if (existingUser) {
        const error = new Error("Ce numero de telephone est deja utilise");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    // HACHAGE DU MOT DE PASSE
    // bcrypt.genSalt(10) genere un "sel" avec 10 tours de complexite
    // bcrypt.hash() hache le mot de passe avec le sel
    // Resultat : "$2a$10$X4rK..." (impossible de retrouver le mot de passe)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // CREATION DE L'UTILISATEUR
    const user = await authModel.createUser({
        full_name,
        phone,
        email,
        password_hash,
        role
    });

    // GENERATION DES TOKENS
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, token, refreshToken };
}

/**
 * Connecter un utilisateur existant.
 *
 * LOGIQUE :
 * 1. Chercher l'utilisateur par son telephone
 * 2. Comparer le mot de passe avec bcrypt.compare()
 * 3. Verifier que le compte est actif
 * 4. Generer un token JWT
 * 5. Renvoyer l'utilisateur + le token
 *
 * @param {string} phone - Le numero de telephone
 * @param {string} password - Le mot de passe en clair
 * @returns {Object} { user, token, refreshToken }
 */
async function login(phone, password) {
    // CHERCHE L'UTILISATEUR
    const user = await authModel.findByPhone(phone);

    if (!user) {
        const error = new Error("Telephone ou mot de passe incorrect");
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
    }

    // VERIFICATION DU MOT DE PASSE
    // bcrypt.compare() compare le mot de passe en clair avec le hash
    // Retourne true ou false
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        const error = new Error("Telephone ou mot de passe incorrect");
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
    }

    // VERIFICATION DU COMPTE ACTIF
    if (!user.is_active) {
        const error = new Error("Ce compte a ete desactive");
        error.statusCode = 403;
        error.isOperational = true;
        throw error;
    }

    // GENERATION DES TOKENS
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // On ne renvoie pas le password_hash
    const { password_hash, ...userSafe } = user;

    return { user: userSafe, token, refreshToken };
}

/**
 * Obtenir le profil de l'utilisateur connecte.
 *
 * @param {number} userId - L'ID de l'utilisateur (du token)
 * @returns {Object} Le profil utilisateur
 */
async function getMe(userId) {
    const user = await authModel.findById(userId);

    if (!user) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return user;
}

/**
 * Rafraichir un token expire.
 *
 * LOGIQUE :
 * 1. Verifier que le refreshToken est valide
 * 2. Decoder le token pour obtenir l'ID utilisateur
 * 3. Generer un nouveau token
 *
 * @param {string} refreshToken - Le token de rafraichissement
 * @returns {Object} { token, refreshToken: newRefreshToken }
 */
async function refreshToken(refreshToken) {
    try {
        // Verifier et decoder le refreshToken
        const decoded = jwt.verify(refreshToken, JWT_SECRET);

        // Chercher l'utilisateur
        const user = await authModel.findById(decoded.id);
        if (!user) {
            const error = new Error("Utilisateur introuvable");
            error.statusCode = 404;
            error.isOperational = true;
            throw error;
        }

        // Generer de nouveaux tokens
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
        const err = new Error("Token de rafraichissement invalide ou expire");
        err.statusCode = 401;
        err.isOperational = true;
        throw err;
    }
}

// =====================================================================
// FONCTIONS UTILITAIRES (pas exportees, utilisees en interne)
// =====================================================================

/**
 * Generer un token JWT d'acces.
 *
 * Le token contient :
 * - id : l'ID de l'utilisateur
 * - role : le role de l'utilisateur
 * - exp : la date d'expiration
 *
 * @param {Object} user - L'utilisateur
 * @returns {string} Le token JWT
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Generer un token de rafraichissement.
 *
 * @param {Object} user - L'utilisateur
 * @returns {string} Le refreshToken JWT
 */
function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
    );
}

module.exports = {
    register,
    login,
    getMe,
    refreshToken
};
