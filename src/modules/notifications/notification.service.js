/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.service.js
// ---------------------------------------------------------------------
// Contient la logique métier du système de notifications:
// diffusion d'évènements d'offres aux chauffeurs, alertes d'acceptation,
// mises à jour de livraison et comptage des notifications non lues.
// =====================================================================

const notificationModel = require("./notification.model");

/**
 * Envoyer une notification individuelle a un utilisateur.
 */
async function sendNotification({ user_id, type, title, body }) {
    return await notificationModel.createNotification({ user_id, type, title, body });
}

/**
 * Notifier TOUS les chauffeurs actifs lorsqu'une nouvelle demande de transport est publiee.
 */
async function notifyAllDriversForNewDemand(demand) {
    const title = "Nouvelle demande de transport";
    const body = `Une nouvelle demande de transport pour ${demand.material_name || "des matériaux"} (${demand.quantity_tons}T) a été publiée.`;
    
    return await notificationModel.notifyAllUsersByRole("chauffeur", {
        type: "new_offer",
        title,
        body
    });
}

/**
 * Notifier le proprietaire d'une demande lorsqu'un chauffeur accepte son offre / demande.
 */
async function notifyOwnerForAcceptedOffer(ownerId, driverName, demandId) {
    const title = "Offre acceptée !";
    const body = `Le chauffeur ${driverName} a accepté votre demande de transport #${demandId}.`;
    
    return await notificationModel.createNotification({
        user_id: ownerId,
        type: "offer_accepted",
        title,
        body
    });
}

/**
 * Notifier le client / proprietaire lors de la mise a jour du statut de livraison.
 */
async function notifyOwnerForDeliveryUpdate(ownerId, statusText) {
    const title = "Mise à jour de votre livraison";
    const body = `Statut de votre livraison : ${statusText}`;

    return await notificationModel.createNotification({
        user_id: ownerId,
        type: "delivery_update",
        title,
        body
    });
}

/**
 * Obtenir la liste des notifications d'un utilisateur.
 */
async function getUserNotifications(userId, isRead, limit, offset) {
    return await notificationModel.findUserNotifications(userId, isRead, limit, offset);
}

/**
 * Obtenir le nombre de notifications non lues.
 */
async function getUnreadCount(userId) {
    return await notificationModel.countUnread(userId);
}

/**
 * Marquer une notification comme lue.
 */
async function markNotificationAsRead(id, userId) {
    return await notificationModel.markAsRead(id, userId);
}

/**
 * Marquer toutes les notifications comme lues.
 */
async function markAllNotificationsAsRead(userId) {
    return await notificationModel.markAllAsRead(userId);
}

/**
 * Supprimer une notification.
 * La suppression est limitee au proprietaire de la notification.
 */
async function deleteNotification(id, userId) {
    const deleted = await notificationModel.deleteNotification(id, userId);
    if (!deleted) {
        const error = new Error("Notification introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
}

module.exports = {
    sendNotification,
    notifyAllDriversForNewDemand,
    notifyOwnerForAcceptedOffer,
    notifyOwnerForDeliveryUpdate,
    getUserNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};
