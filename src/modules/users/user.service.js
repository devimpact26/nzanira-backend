const userModel = require("./user.model");

async function getAllUsers() {
    return await userModel.findAll();
}

async function getUserById(id) {
    return await userModel.findById(id);
}

async function createUser(userData) {

    if (!userData.name || !userData.email) {
        throw new Error("Le nom et l'email sont obligatoires");
    }

    return await userModel.create(userData);
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser
};