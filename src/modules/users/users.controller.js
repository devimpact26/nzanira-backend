const usersService = require("./users.service");

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

// DELETE /api/users/:id
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
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
    deleteUser
};
