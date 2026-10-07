/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.controller.js
// ---------------------------------------------------------------------
// Gère les requêtes HTTP pour les notifications utilisateurs.
// Reçoit req/res, filtre par statut de lecture et renvoie les réponses.
// =====================================================================

const notificationService = require("./notification.service");

/**
 * GET /api/notifications
 * Recuperer les notifications de l'utilisateur.
 */
async function getNotifications(req, res, next) {
    try {
        const userId = req.user.id;
        const isReadParam = req.query.is_read;
        let isRead = undefined;

        if (isReadParam === "true" || isReadParam === "1") isRead = true;
        if (isReadParam === "false" || isReadParam === "0") isRead = false;

        const notifications = await notificationService.getUserNotifications(
            userId, isRead, req.query.limit, req.query.offset
        );

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/notifications/unread/count
 * Obtenir le nombre de notifications non lues.
 */
async function getUnreadCount(req, res, next) {
    try {
        const userId = req.user.id;
        const count = await notificationService.getUnreadCount(userId);

        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/notifications/:id/read
 * Marquer une notification comme lue.
 */
async function markAsRead(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await notificationService.markNotificationAsRead(id, userId);

        res.json({
            success: true,
            message: "Notification mequée comme lue"
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/notifications/read-all
 * Marquer toutes les notifications comme lues.
 */
async function markAllAsRead(req, res, next) {
    try {
        const userId = req.user.id;

        await notificationService.markAllNotificationsAsRead(userId);

        res.json({
            success: true,
            message: "Toutes les notifications ont été marquées comme lues"
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/notifications
 * Creer une notification.
 * Body : { user_id, type, title, body? }
 */
async function createNotification(req, res, next) {
    try {
        const { user_id, type, title, body } = req.body;

        const notification = await notificationService.sendNotification({
            user_id, type, title, body
        });

        res.status(201).json({
            success: true,
            message: "Notification créée avec succès",
            data: notification
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/notifications/:id
 * Supprimer une notification (la sienne uniquement).
 */
async function deleteNotification(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await notificationService.deleteNotification(id, userId);

        res.json({
            success: true,
            message: "Notification supprimée avec succès"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification
};
