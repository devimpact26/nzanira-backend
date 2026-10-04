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

// Authentification JWT obligatoire sur toutes les routes de messagerie / avis
router.use(authenticate);

// POST /reviews - Créer un avis
router.post(
    "/reviews",
    validate(createReviewSchema),
    reviewController.createReview
);

// GET /reviews - Liste des avis (Admin ou filtré)
router.get(
    "/reviews",
    validate(getReviewsQuerySchema, "query"),
    reviewController.getAllReviews
);

// GET /reviews/me & GET /reviews/my-reviews - Avis laissés par l'utilisateur connecté
router.get("/reviews/me", reviewController.getMyReviews);
router.get("/reviews/my-reviews", reviewController.getMyReviews);

// GET /reviews/user/:userId/stats - Note moyenne et total d'avis d'un utilisateur
router.get("/reviews/user/:userId/stats", reviewController.getUserStats);

// GET /reviews/user/:userId - Liste des avis reçus par un utilisateur
router.get("/reviews/user/:userId", reviewController.getUserReviews);

// GET /reviews/delivery/:deliveryId - Vérifier si l'utilisateur a évalué cette livraison
router.get("/reviews/delivery/:deliveryId", reviewController.getDeliveryReviewStatus);

// DELETE /reviews/:id - Supprimer un avis (Auteur ou Admin)
router.delete("/reviews/:id", reviewController.deleteReview);

module.exports = router;
