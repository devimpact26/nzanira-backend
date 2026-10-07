/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// messaging.routes.js
// ---------------------------------------------------------------------
// Définit les routes Express de l'API REST pour le module Messagerie.
// Protège les endpoints avec le middleware JWT et applique la validation.
// =====================================================================

const express = require("express");
const router = express.Router();

const messagingController = require("./messaging.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const {
    validate,
    createConversationSchema,
    sendMessageSchema,
    getMessagesQuerySchema
} = require("./messaging.validator");

// NOTE : authenticate est declare SUR CHAQUE ROUTE (et non via un
// router.use(authenticate) global). Comme ce router est monte a la
// racine de /api, un router.use() aurait intercepte TOUTES les URLs
// inconnues de l'API et renvoyait 401 au lieu du 404 attendu.

// GET /api/conversations - Liste des conversations de l'utilisateur
router.get("/conversations", authenticate, messagingController.getConversations);

// POST /api/conversations - Créer ou obtenir une conversation
router.post(
    "/conversations",
    authenticate,
    validate(createConversationSchema),
    messagingController.createConversation
);

// GET /api/conversations/:id - Détails d'une conversation
router.get("/conversations/:id", authenticate, messagingController.getConversationById);

// GET /api/conversations/:id/messages - Obtenir l'historique des messages
router.get(
    "/conversations/:id/messages",
    authenticate,
    validate(getMessagesQuerySchema, "query"),
    messagingController.getMessages
);

// POST /api/conversations/:id/messages - Envoyer un message
router.post(
    "/conversations/:id/messages",
    authenticate,
    validate(sendMessageSchema),
    messagingController.sendMessage
);

// PUT /api/conversations/:id/read - Marquer la conversation comme lue
router.put("/conversations/:id/read", authenticate, messagingController.markAsRead);

// Alias pour compatibilite avec l'API spec (PUT /api/messages/:id/read)
router.put("/messages/:id/read", authenticate, messagingController.markAsRead);

module.exports = router;
