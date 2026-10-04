/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Gestionnaire de requêtes HTTP pour le module des avis.
 */

const reviewService = require("./review.service");

/**
 * Publier un avis.
 * POST /reviews
 */
async function createReview(req, res, next) {
    try {
        const review = await reviewService.createReview(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            message: "Avis enregistré avec succès",
            data: review
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Récupérer les avis d'un utilisateur et ses statistiques.
 * GET /reviews/user/:userId
 */
async function getUserReviews(req, res, next) {
    try {
        const result = await reviewService.getUserReviews(req.params.userId, req.query);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Récupérer uniquement les statistiques/note moyenne d'un utilisateur.
 * GET /reviews/user/:userId/stats
 */
async function getUserStats(req, res, next) {
    try {
        const stats = await reviewService.getUserStats(req.params.userId);
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Récupérer les avis soumis par l'utilisateur connecté.
 * GET /reviews/me
 */
async function getMyReviews(req, res, next) {
    try {
        const reviews = await reviewService.getMySubmittedReviews(req.user.id, req.query);
        return res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Vérifier si l'utilisateur connecté a déjà évalué une livraison.
 * GET /reviews/delivery/:deliveryId
 */
async function getDeliveryReviewStatus(req, res, next) {
    try {
        const status = await reviewService.getDeliveryReviewStatus(req.params.deliveryId, req.user.id);
        return res.status(200).json({
            success: true,
            data: status
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Liste générale des avis (Filtres & Admin).
 * GET /reviews
 */
async function getAllReviews(req, res, next) {
    try {
        const reviews = await reviewService.getAllReviews(req.query);
        return res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Supprimer un avis.
 * DELETE /reviews/:id
 */
async function deleteReview(req, res, next) {
    try {
        await reviewService.deleteReview(req.params.id, req.user);
        return res.status(200).json({
            success: true,
            message: "Avis supprimé avec succès"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createReview,
    getUserReviews,
    getUserStats,
    getMyReviews,
    getDeliveryReviewStatus,
    getAllReviews,
    deleteReview
};
