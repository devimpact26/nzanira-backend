/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.routes.js
// ---------------------------------------------------------------------
// Définit les routes Express de l'API REST pour les notifications.
// Protège les endpoints avec le middleware JWT et applique la validation.
//
// NOTE : authenticate est declare SUR CHAQUE ROUTE (et non via un
// router.use(authenticate) global). Comme ce router est monte a la
// racine de /api, un router.use() aurait intercepte TOUTES les URLs
// inconnues de l'API et renvoyait 401 au lieu du 404 attendu.
// =====================================================================

const express = require("express");
const router = express.Router();

const notificationController = require("./notification.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const {
    validate,
    getNotificationsQuerySchema,
    createNotificationSchema
} = require("./notification.validator");

// GET /api/notifications - List user notifications
router.get(
    "/notifications",
    authenticate,
    validate(getNotificationsQuerySchema, "query"),
    notificationController.getNotifications
);

// GET /api/notifications/unread/count - Get count of unread notifications
router.get("/notifications/unread/count", authenticate, notificationController.getUnreadCount);

// POST /api/notifications - Create a notification
router.post(
    "/notifications",
    authenticate,
    validate(createNotificationSchema),
    notificationController.createNotification
);

// PUT /api/notifications/read-all - Mark all notifications as read
// IMPORTANT : doit rester AVANT /notifications/:id/read
router.put("/notifications/read-all", authenticate, notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/notifications/:id/read", authenticate, notificationController.markAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete("/notifications/:id", authenticate, notificationController.deleteNotification);

module.exports = router;
