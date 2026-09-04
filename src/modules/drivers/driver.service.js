/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const driverModel = require("./driver.model");

// Règle d'or du projet : on ne touche jamais au model d'un autre module.
// On passe par le service du module users pour vérifier que le user existe
// et a bien le rôle "chauffeur". Adapte le chemin/nom si ton coéquipier
// du module users a exporté autrement (vérifie users/index.js).
const usersService = require("../users").usersService;

function notFound(message) {
    const err = new Error(message);
    err.statusCode = 404;
    return err;
}

function conflict(message) {
    const err = new Error(message);
    err.statusCode = 409;
    return err;
}

// ---------- Profil chauffeur ----------

async function getAllDrivers(filters) {
    return driverModel.findAll(filters);
}

async function getDriverByUserId(userId) {
    const driver = await driverModel.findByUserId(userId);
    if (!driver) throw notFound("Profil chauffeur introuvable");
    return driver;
}

async function getDriverFullProfile(userId) {
    const driver = await driverModel.findFullProfile(userId);
    if (!driver) throw notFound("Profil chauffeur introuvable");
    return driver;
}

async function createDriverProfile({ user_id, work_status, company_id }) {
    // Vérifie que le user existe et a le rôle chauffeur
    const user = await usersService.getUserById(user_id);
    if (!user) throw notFound("Utilisateur introuvable");
    if (user.role !== "chauffeur") {
        const err = new Error("Cet utilisateur n'a pas le rôle chauffeur");
        err.statusCode = 400;
        throw err;
    }

    // Vérifie qu'il n'a pas déjà un profil (contrainte UNIQUE user_id en base)
    const existing = await driverModel.findByUserId(user_id);
    if (existing) throw conflict("Ce chauffeur a déjà un profil");

    return driverModel.create({ user_id, work_status, company_id });
}

async function updateDriverProfile(userId, data) {
    await getDriverByUserId(userId); // 404 si inexistant
    return driverModel.update(userId, data);
}

async function deleteDriverProfile(userId) {
    await getDriverByUserId(userId); // 404 si inexistant
    return driverModel.remove(userId);
}

// ---------- Position GPS ----------

async function getDriverLocation(userId) {
    await getDriverByUserId(userId); // le chauffeur doit exister
    const location = await driverModel.getLatestLocation(userId);
    if (!location) throw notFound("Aucune position enregistrée pour ce chauffeur");
    return location;
}

async function updateDriverLocation(userId, { lat, lng, speed_kmh }) {
    await getDriverByUserId(userId); // le chauffeur doit exister
    return driverModel.insertLocation(userId, { lat, lng, speed_kmh });
}

async function getAvailableDrivers({ lat, lng, radius_km }) {
    if (!lat || !lng) {
        const err = new Error("lat et lng sont requis");
        err.statusCode = 400;
        throw err;
    }
    return driverModel.findAvailable({ lat, lng, radius_km });
}

module.exports = {
    getAllDrivers,
    getDriverByUserId,
    getDriverFullProfile,
    createDriverProfile,
    updateDriverProfile,
    deleteDriverProfile,
    getDriverLocation,
    updateDriverLocation,
    getAvailableDrivers,
};
