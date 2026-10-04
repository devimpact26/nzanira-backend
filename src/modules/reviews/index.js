/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Fichier barrel exportant l'ensemble des éléments du module Reviews.
 */

const reviewController = require("./review.controller");
const reviewService = require("./review.service");
const reviewModel = require("./review.model");
const reviewRoutes = require("./reviews.routes");
const reviewValidator = require("./review.validator");

module.exports = {
    reviewController,
    reviewService,
    reviewModel,
    reviewRoutes,
    reviewValidator
};
