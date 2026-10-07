const usersService = require("./users.service");

// =====================================================================
// Garde d'autorisation
// -----------------------------------------------------------------
// Spec AGENTS.md : GET/PUT/DELETE /users/:id = "son profil" uniquement,
// l'admin pouvant toucher a tous les comptes.
// Sans cette verification, n'importe quel utilisateur connecte pouvait
// modifier (ou supprimer) le compte d'un autre utilisateur.
// =====================================================================
function isOwnerOrAdmin(authUser, id) {
    return Number(authUser.id) === Number(id) || authUser.role === "admin";
}

function forbidden(res) {
    return res.status(403).json({
        success: false,
        message: "Acces refuse : vous ne pouvez agir que sur votre propre compte"
    });
}

// GET /api/users
async function getUsers(req, res, next) {
    try {
        const filters = req.query;
        const users = await usersService.getAllUsers(filters);
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

// GET /api/users/:id
async function getUserById(req, res, next) {
    try {
        const { id } = req.params;

        if (!isOwnerOrAdmin(req.user, id)) return forbidden(res);

        const user = await usersService.getUserById(id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

// POST /api/users
async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await usersService.createUser(userData);
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

// PUT /api/users/:id
async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!isOwnerOrAdmin(req.user, id)) return forbidden(res);

        const user = await usersService.updateUser(id, updates);
        res.json({
            success: true,
            message: "Utilisateur modifié avec succès",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

// PUT /api/users/:id/settings
// Body : { gps_enabled, lang, theme }
async function updateSettings(req, res, next) {
    try {
        const { id } = req.params;

        if (!isOwnerOrAdmin(req.user, id)) return forbidden(res);

        const { gps_enabled, lang, theme } = req.body;
        const updates = {};
        if (gps_enabled !== undefined) updates.gps_enabled = gps_enabled;
        if (lang !== undefined) updates.lang = lang;
        if (theme !== undefined) updates.theme = theme;

        const user = await usersService.updateUser(id, updates);
        res.json({
            success: true,
            message: "Paramètres mis à jour avec succès",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

// PUT /api/users/:id/verify
// Body : { is_verified: 1 } — réservé à l'administrateur.
// NOTE : le rôle "admin" n'existe pas encore dans l'enum de la table
// users ; cette route renverra 403 tant que le rôle n'aura pas été ajouté.
async function verifyUser(req, res, next) {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Acces interdit — role insuffisant"
            });
        }

        const user = await usersService.updateUser(id, { is_verified: 1 });
        res.json({
            success: true,
            message: "Utilisateur vérifié avec succès",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

// DELETE /api/users/:id
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        if (!isOwnerOrAdmin(req.user, id)) return forbidden(res);

        await usersService.deleteUser(id);
        res.json({ success: true, message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateSettings,
    verifyUser,
    deleteUser
};
