 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// index.js — Barrel Export du module auth
// =====================================================================

const authController = require("./auth.controller");
const authService = require("./auth.service");
const authModel = require("./auth.model");
const authRoutes = require("./auth.routes");
const { registerSchema, loginSchema, refreshSchema, validate } = require("./auth.validator");

module.exports = {
    authController,
    authService,
    authModel,
    authRoutes,
    authValidator: {
        registerSchema,
        loginSchema,
        refreshSchema,
        validate
    }
};
