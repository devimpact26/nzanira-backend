// =====================================================================
// auth.middleware.js
// -----------------------------------------------------------------
// Middleware d'authentification JWT.
// Verifie que l'utilisateur a un token valide avant d'acceder a la route.
//
// UTILISATION DANS LES ROUTES :
//   router.get("/profil", authenticate, controller.getProfil);
//   router.post("/voiture", authenticate, authorize("chauffeur"), controller.create);
//
// COMMENT CA MARCHE ?
// 1. Le client envoie le token dans le header : Authorization: Bearer <token>
// 2. Le middleware extrait le token
// 3. Il verifie la signature avec JWT_SECRET
// 4. Il decode le contenu (id, role, expiration)
// 5. Si tout est OK, il met req.user = { id, role } et appelle next()
// 6. Si erreur, il renvoie 401
// =====================================================================

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nzanapp-secret-change-in-production";

/**
 * Middleware d'authentification.
 *
 * Verifie la validite du token JWT dans le header Authorization.
 * Si valide, ajoute req.user = { id, role } et passe au middleware suivant.
 * Si invalide ou manquant, renvoie une erreur 401.
 */
function authenticate(req, res, next) {
    // 1. Recuperer le header Authorization
    const authHeader = req.headers.authorization;

    // Verifier que le header existe et commence par "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token manquant"
        });
    }

    // 2. Extraire le token (apres "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verifier et decoder le token
        // jwt.verify() verifie la signature ET la date d'expiration
        // Si le token est invalide ou expire, il lance une erreur
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Ajouter les infos utilisateur a la requete
        // Le controller pourra utiliser req.user.id et req.user.role
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        // 5. Tout est OK, on passe au middleware suivant (ou au controller)
        next();
    } catch (error) {
        // Token invalide ou expire
        return res.status(401).json({
            success: false,
            message: "Token invalide ou expire"
        });
    }
}

module.exports = { authenticate };
