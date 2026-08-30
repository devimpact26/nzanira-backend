const userService = require("./user.service");

async function getUsers(req, res) {
    try {
        const users = await userService.getAllUsers();

        res.json({
            success: true,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getUserById(req, res) {
    try {

        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function createUser(req, res) {

    try {

        const result = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser
};