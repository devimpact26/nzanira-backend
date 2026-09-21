/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.routes.js
// ---------------------------------------------------------------------
// Définit les routes Express de l'API REST pour les notifications.
// Protège les endpoints avec l'authentification JWT et valide les paramètres query.
// =====================================================================

const express = require("express");
const router = express.Router();

const notificationController = require("./notification.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { validate, getNotificationsQuerySchema } = require("./notification.validator");

// Protect all notification routes with JWT authentication
router.use(authenticate);

// GET /api/notifications - List user notifications
router.get("/notifications", validate(getNotificationsQuerySchema, "query"), notificationController.getNotifications);

// GET /api/notifications/unread/count - Get count of unread notifications
router.get("/notifications/unread/count", notificationController.getUnreadCount);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put("/notifications/read-all", notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/notifications/:id/read", notificationController.markAsRead);

module.exports = router;
