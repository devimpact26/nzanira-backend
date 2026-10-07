/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Définit les routes Express de l'API REST pour le module Avis & Notations.
 */

const express = require("express");
const router = express.Router();

const reviewController = require("./review.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const {
    validate,
    createReviewSchema,
    getReviewsQuerySchema
} = require("./review.validator");

// NOTE : authenticate est declare SUR CHAQUE ROUTE (et non via un
// router.use(authenticate) global). Comme ce router est monte a la
// racine de /api, un router.use() aurait intercepte TOUTES les URLs
// inconnues de l'API et renvoyait 401 au lieu du 404 attendu.

// POST /reviews - Créer un avis
router.post(
    "/reviews",
    authenticate,
    validate(createReviewSchema),
    reviewController.createReview
);

// GET /reviews - Liste des avis (Admin ou filtré)
router.get(
    "/reviews",
    authenticate,
    validate(getReviewsQuerySchema, "query"),
    reviewController.getAllReviews
);

// GET /reviews/me & GET /reviews/my-reviews - Avis laissés par l'utilisateur connecté
router.get("/reviews/me", authenticate, reviewController.getMyReviews);
router.get("/reviews/my-reviews", authenticate, reviewController.getMyReviews);

// GET /reviews/user/:userId/stats - Note moyenne et total d'avis d'un utilisateur
router.get("/reviews/user/:userId/stats", authenticate, reviewController.getUserStats);

// GET /reviews/user/:userId - Liste des avis reçus par un utilisateur
router.get("/reviews/user/:userId", authenticate, reviewController.getUserReviews);

// GET /reviews/delivery/:deliveryId - Vérifier si l'utilisateur a évalué cette livraison
router.get("/reviews/delivery/:deliveryId", authenticate, reviewController.getDeliveryReviewStatus);

// DELETE /reviews/:id - Supprimer un avis (Auteur ou Admin)
router.delete("/reviews/:id", authenticate, reviewController.deleteReview);

module.exports = router;
