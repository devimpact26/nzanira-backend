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

// Application de l'authentification JWT sur toutes les routes de messagerie
router.use(authenticate);

// GET /api/conversations - Liste des conversations de l'utilisateur
router.get("/conversations", messagingController.getConversations);

// POST /api/conversations - Créer ou obtenir une conversation
router.post(
    "/conversations",
    validate(createConversationSchema),
    messagingController.createConversation
);

// GET /api/conversations/:id - Détails d'une conversation
router.get("/conversations/:id", messagingController.getConversationById);

// GET /api/conversations/:id/messages - Obtenir l'historique des messages
router.get(
    "/conversations/:id/messages",
    validate(getMessagesQuerySchema, "query"),
    messagingController.getMessages
);

// POST /api/conversations/:id/messages - Envoyer un message
router.post(
    "/conversations/:id/messages",
    validate(sendMessageSchema),
    messagingController.sendMessage
);

// PUT /api/conversations/:id/read - Marquer la conversation comme lue
router.put("/conversations/:id/read", messagingController.markAsRead);

// Alias pour compatibilite avec l'API spec (PUT /api/messages/:id/read)
router.put("/messages/:id/read", messagingController.markAsRead);

module.exports = router;
