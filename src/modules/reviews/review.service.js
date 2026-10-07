/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Logique métier pour la gestion des avis et notations.
 */

const reviewModel = require("./review.model");
const { AppError } = require("../../middleware/errorHandler");

function badRequest(message) {
    return new AppError(message, 400);
}

function notFound(message) {
    return new AppError(message, 404);
}

function forbidden(message) {
    return new AppError(message, 403);
}

function conflict(message) {
    return new AppError(message, 409);
}

/**
 * Soumettre un avis pour une livraison terminée.
 */
async function createReview(raterId, reviewData) {
    // Le validator accepte les deux notations (camelCase et snake_case de la spec)
    const deliveryId = reviewData.deliveryId ?? reviewData.delivery_id;
    const requestId = reviewData.requestId ?? reviewData.request_id;
    const reviewedUserId = reviewData.reviewedUserId ?? reviewData.rated_id;
    const rating = reviewData.rating;
    const score = reviewData.score;
    const comment = reviewData.comment;

    const reviewScore = rating !== undefined ? rating : score;
    const identifier = deliveryId || requestId;

    if (!identifier) {
        throw badRequest("Identifiant de livraison ou de demande requis");
    }

    // 1. Récupérer le contexte du transport/livraison
    const context = await reviewModel.findDeliveryContext(identifier);
    if (!context) {
        throw notFound("Livraison ou demande de transport introuvable");
    }

    // 2. Vérifier que la livraison est bien terminée
    const isCompleted = context.delivery_status === "delivered" || context.request_status === "delivered";
    if (!isCompleted) {
        throw badRequest("Impossible de déposer un avis sur une livraison non terminée");
    }

    // 3. Vérifier que l'utilisateur connecté est un participant (Seeker ou Driver)
    const isRequester = raterId === context.requester_id;
    const isDriver = raterId === context.driver_id;

    if (!isRequester && !isDriver) {
        throw forbidden("Vous ne pouvez pas évaluer une livraison à laquelle vous n'avez pas participé");
    }

    // 4. Déterminer automatiquement l'utilisateur évalué
    const expectedRatedId = isRequester ? context.driver_id : context.requester_id;

    if (!expectedRatedId) {
        throw badRequest("Le participant à évaluer est introuvable");
    }

    if (reviewedUserId && parseInt(reviewedUserId, 10) !== expectedRatedId) {
        throw badRequest("L'utilisateur spécifié ne correspond pas au participant de la livraison");
    }

    // 5. Empêcher les avis en double
    const existing = await reviewModel.findExistingReview(context.request_id, raterId, expectedRatedId);
    if (existing) {
        throw conflict("Vous avez déjà laissé un avis pour cette livraison");
    }

    // 6. Enregistrer le nouvel avis
    return reviewModel.create({
        request_id: context.request_id,
        rater_id: raterId,
        rated_id: expectedRatedId,
        score: parseInt(reviewScore, 10),
        comment: comment ? comment.trim() : null
    });
}

/**
 * Obtenir les avis reçus par un utilisateur ainsi que sa note moyenne.
 */
async function getUserReviews(userId, filters = {}) {
    const reviews = await reviewModel.findAll({ ...filters, rated_id: userId });
    const stats = await reviewModel.findUserStats(userId);

    return {
        stats,
        reviews
    };
}

/**
 * Obtenir la note moyenne d'un utilisateur.
 */
async function getUserStats(userId) {
    return reviewModel.findUserStats(userId);
}

/**
 * Obtenir les avis soumis par l'utilisateur connecté.
 */
async function getMySubmittedReviews(raterId, filters = {}) {
    return reviewModel.findAll({ ...filters, rater_id: raterId });
}

/**
 * Vérifier le statut de l'avis pour une livraison donnée par un utilisateur.
 */
async function getDeliveryReviewStatus(deliveryIdOrRequestId, userId) {
    const context = await reviewModel.findDeliveryContext(deliveryIdOrRequestId);
    if (!context) {
        throw notFound("Livraison introuvable");
    }

    const isRequester = userId === context.requester_id;
    const isDriver = userId === context.driver_id;

    if (!isRequester && !isDriver) {
        throw forbidden("Vous n'êtes pas participant à cette livraison");
    }

    const expectedRatedId = isRequester ? context.driver_id : context.requester_id;
    const existing = expectedRatedId
        ? await reviewModel.findExistingReview(context.request_id, userId, expectedRatedId)
        : null;

    return {
        hasReviewed: !!existing,
        review: existing || null
    };
}

/**
 * Récupérer tous les avis (Admin / Filtre général).
 */
async function getAllReviews(filters = {}) {
    return reviewModel.findAll(filters);
}

/**
 * Supprimer un avis (par l'auteur ou un administrateur).
 */
async function deleteReview(reviewId, user) {
    const review = await reviewModel.findById(reviewId);
    if (!review) {
        throw notFound("Avis introuvable");
    }

    if (user.role !== "admin" && review.rater_id !== user.id) {
        throw forbidden("Vous n'êtes pas autorisé à supprimer cet avis");
    }

    return reviewModel.remove(reviewId);
}

module.exports = {
    createReview,
    getUserReviews,
    getUserStats,
    getMySubmittedReviews,
    getDeliveryReviewStatus,
    getAllReviews,
    deleteReview
};
