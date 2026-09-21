/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// index.js
// ---------------------------------------------------------------------
// Fichier barrel exportant l'ensemble des éléments du module Notifications
// (controller, service, model, routes et validator).
// =====================================================================

const notificationController = require("./notification.controller");
const notificationService = require("./notification.service");
const notificationModel = require("./notification.model");
const notificationRoutes = require("./notification.routes");
const notificationValidator = require("./notification.validator");

module.exports = {
    notificationController,
    notificationService,
    notificationModel,
    notificationRoutes,
    notificationValidator
};
