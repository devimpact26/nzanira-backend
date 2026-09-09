/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const driverModel = require("./driver.model");

// Le module "users" n'existe pas encore chez toi (en cours chez ton coéquipier).
// On charge la dépendance de façon "safe" pour ne pas bloquer ton dev :
// si le module existe, on l'utilise ; sinon, on utilise un stub temporaire.
let usersService;
try {
    usersService = require("../users").usersService;
} catch (e) {
    usersService = null;
}

async function getUserByIdSafe(userId) {
    if (usersService) {
        return usersService.getUserById(userId);
    }
    // STUB TEMPORAIRE — à supprimer dès que le module users est disponible.
    console.warn("[drivers] usersService indisponible — vérification user_id/role ignorée (mode stub)");
    return { id: userId, role: "chauffeur" };
}

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
    const user = await getUserByIdSafe(user_id);
    if (!user) throw notFound("Utilisateur introuvable");
    if (user.role !== "chauffeur") {
        const err = new Error("Cet utilisateur n'a pas le rôle chauffeur");
        err.statusCode = 400;
        throw err;
    }

    const existing = await driverModel.findByUserId(user_id);
    if (existing) throw conflict("Ce chauffeur a déjà un profil");

    return driverModel.create({ user_id, work_status, company_id });
}

async function updateDriverProfile(userId, data) {
    await getDriverByUserId(userId);
    return driverModel.update(userId, data);
}

async function deleteDriverProfile(userId) {
    await getDriverByUserId(userId);
    return driverModel.remove(userId);
}

async function getDriverLocation(userId) {
    await getDriverByUserId(userId);
    const location = await driverModel.getLatestLocation(userId);
    if (!location) throw notFound("Aucune position enregistrée pour ce chauffeur");
    return location;
}

async function updateDriverLocation(userId, { lat, lng, speed_kmh }) {
    await getDriverByUserId(userId);
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
