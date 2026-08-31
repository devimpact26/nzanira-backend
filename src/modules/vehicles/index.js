 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

// =====================================================================
// index.js — Barrel Export (Exportations en baril)
// -----------------------------------------------------------------
// ROLE : Exporter tous les fichiers du module en UN SEUL import.
//
// POURQUOI ?
// - Sans ce fichier, il faudrait faire :
//     require("./vehicle.controller")
//     require("./vehicle.service")
//     require("./vehicle.model")
//   dans chaque fichier qui a besoin du module vehicles.
//
// - Avec ce fichier, on fait juste :
//     const { vehicleController, vehicleService } = require("../modules/vehicles");
//
// COMMENT CA MARCHE ?
// - On importe chaque fichier du module
// - On les re-exporte dans un seul objet
// - C'est plus propre et plus simple a maintenir
//
// EXEMPLE D'UTILISATION :
//   const { vehicleRoutes } = require("./modules/vehicles");
//   router.use("/vehicles", vehicleRoutes);
// =====================================================================

const vehicleController = require("./vehicle.controller");
const vehicleService = require("./vehicle.service");
const vehicleModel = require("./vehicle.model");
const vehicleRoutes = require("./vehicle.routes");
const {
    createVehicleSchema,
    updateVehicleSchema,
    queryVehicleSchema,
    validate
} = require("./vehicle.validator");

module.exports = {
    vehicleController,
    vehicleService,
    vehicleModel,
    vehicleRoutes,
    vehicleValidator: {
        createVehicleSchema,
        updateVehicleSchema,
        queryVehicleSchema,
        validate
    }
};
