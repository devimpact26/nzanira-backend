/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const driverService = require("./driver.service");

// ---------- Profil chauffeur ----------

async function getDrivers(req, res, next) {
    try {
        const filters = {
            work_status: req.query.work_status,
            company_id: req.query.company_id,
        };
        const drivers = await driverService.getAllDrivers(filters);
        res.json({ success: true, data: drivers });
    } catch (error) {
        next(error);
    }
}

async function getDriverById(req, res, next) {
    try {
        const driver = await driverService.getDriverByUserId(req.params.id);
        res.json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
}

async function getDriverFull(req, res, next) {
    try {
        const driver = await driverService.getDriverFullProfile(req.params.id);
        res.json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
}

async function createDriver(req, res, next) {
    try {
        const driver = await driverService.createDriverProfile(req.body);
        res.status(201).json({
            success: true,
            message: "Profil chauffeur créé",
            data: driver,
        });
    } catch (error) {
        next(error);
    }
}

async function updateDriver(req, res, next) {
    try {
        const driver = await driverService.updateDriverProfile(
            req.params.id,
            req.body
        );
        res.json({
            success: true,
            message: "Profil chauffeur mis à jour",
            data: driver,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteDriver(req, res, next) {
    try {
        await driverService.deleteDriverProfile(req.params.id);
        res.json({ success: true, message: "Profil chauffeur supprimé" });
    } catch (error) {
        next(error);
    }
}

// ---------- Position GPS ----------

async function getLocation(req, res, next) {
    try {
        const location = await driverService.getDriverLocation(req.params.id);
        res.json({ success: true, data: location });
    } catch (error) {
        next(error);
    }
}

async function updateLocation(req, res, next) {
    try {
        const location = await driverService.updateDriverLocation(
            req.params.id,
            req.body
        );
        res.json({ success: true, data: location });
    } catch (error) {
        next(error);
    }
}

async function getAvailable(req, res, next) {
    try {
        const { lat, lng, radius_km } = req.query;
        const drivers = await driverService.getAvailableDrivers({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            radius_km: radius_km ? parseFloat(radius_km) : undefined,
        });
        res.json({ success: true, data: drivers });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDrivers,
    getDriverById,
    getDriverFull,
    createDriver,
    updateDriver,
    deleteDriver,
    getLocation,
    updateLocation,
    getAvailable,
};
