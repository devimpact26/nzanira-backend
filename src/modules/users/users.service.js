const usersModel = require("./users.model");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function getAllUsers(filters) {
    return await usersModel.findUsers(filters);
}

async function getUserById(id) {
    const user = await usersModel.findUserById(id);
    if (!user) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return user;
}

async function createUser(userData) {
    // Validate unique phone
    const existing = await usersModel.findUserByPhone(userData.phone);
    if (existing) {
        const error = new Error("Un utilisateur avec ce téléphone existe déjà");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    // Hash password before saving (expecting 'password' in userData)
    if (!userData.password) {
        const error = new Error("Le mot de passe est requis");
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }
    const password_hash = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const toCreate = {
        full_name: userData.full_name,
        phone: userData.phone,
        email: userData.email || null,
        password_hash,
        role: userData.role || "proprietaire",
        lang: userData.lang || "fr",
        theme: userData.theme || "dark",
        gps_enabled: userData.gps_enabled ? 1 : 0,
        is_verified: userData.is_verified ? 1 : 0,
        is_active: userData.is_active !== undefined ? (userData.is_active ? 1 : 0) : 1
    };

    const created = await usersModel.createUser(toCreate);
    return created;
}

async function updateUser(id, updates) {
    const user = await usersModel.findUserById(id);
    if (!user) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    // If phone changed, check uniqueness
    if (updates.phone && updates.phone !== user.phone) {
        const existing = await usersModel.findUserByPhone(updates.phone);
        if (existing) {
            const error = new Error("Ce numéro de téléphone est déjà utilisé");
            error.statusCode = 409;
            error.isOperational = true;
            throw error;
        }
    }

    // If password provided, hash it
    if (updates.password) {
        updates.password_hash = await bcrypt.hash(updates.password, SALT_ROUNDS);
        delete updates.password;
    }

    const updated = await usersModel.updateUser(id, updates);
    if (!updated) {
        const error = new Error("Échec de la mise à jour de l'utilisateur");
        error.statusCode = 500;
        error.isOperational = true;
        throw error;
    }
    return updated;
}

async function deleteUser(id) {
    const user = await usersModel.findUserById(id);
    if (!user) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    const ok = await usersModel.deleteUser(id);
    if (!ok) {
        const error = new Error("Impossible de supprimer l'utilisateur");
        error.statusCode = 500;
        error.isOperational = true;
        throw error;
    }
    return true;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
