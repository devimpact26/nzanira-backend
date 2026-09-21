/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// index.js
// ---------------------------------------------------------------------
// Fichier barrel exportant l'ensemble des éléments du module Messaging
// (controller, service, model, routes et validator).
// =====================================================================

const messagingController = require("./messaging.controller");
const messagingService = require("./messaging.service");
const messagingModel = require("./messaging.model");
const messagingRoutes = require("./messaging.routes");
const messagingValidator = require("./messaging.validator");

module.exports = {
    messagingController,
    messagingService,
    messagingModel,
    messagingRoutes,
    messagingValidator
};
