/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// messaging.controller.js
// ---------------------------------------------------------------------
// Gère les requêtes HTTP pour la messagerie entre propriétaires, 
// fournisseurs et chauffeurs. Reçoit req/res, effectue les vérifications
// contextuelles via le service et retourne les réponses formatées.
// =====================================================================

const messagingService = require("./messaging.service");

/**
 * GET /api/conversations
 * Recuperer les conversations de l'utilisateur connecte.
 */
async function getConversations(req, res, next) {
    try {
        const userId = req.user.id;
        const conversations = await messagingService.getUserConversations(userId);

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/conversations/:id
 * Recuperer une conversation par son ID avec infos contextuelles.
 */
async function getConversationById(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const conversation = await messagingService.getConversationById(id, userId);

        res.json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/conversations
 * Creer ou recuperer une conversation contextuelle.
 */
async function createConversation(req, res, next) {
    try {
        const { request_id, driver_id, owner_id } = req.body;
        const authenticatedUserId = req.user.id;

        const conversation = await messagingService.getOrCreateConversation(
            { request_id, driver_id, owner_id },
            authenticatedUserId
        );

        res.status(201).json({
            success: true,
            message: "Conversation initialisée avec succès",
            data: conversation
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/conversations/:id/messages
 * Recuperer l'historique des messages d'une conversation.
 */
async function getMessages(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { limit, offset } = req.query;

        const messages = await messagingService.getConversationMessages(id, userId, { limit, offset });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/conversations/:id/messages
 * Envoyer un message dans une conversation.
 */
async function sendMessage(req, res, next) {
    try {
        const { id } = req.params;
        const sender_id = req.user.id; // Enforce authenticated user as sender
        const { content } = req.body;

        const message = await messagingService.sendMessage({
            conversation_id: id,
            sender_id,
            content
        });

        res.status(201).json({
            success: true,
            message: "Message envoyé avec succès",
            data: message
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/messages/:id/read ou PUT /api/conversations/:id/read
 * Marquer les messages d'une conversation comme lus.
 */
async function markAsRead(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await messagingService.markAsRead(id, userId);

        res.json({
            success: true,
            message: "Messages marqués comme lus"
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/messages/:id/read
 * Marquer UN message (id = message) comme lu.
 */
async function markMessageAsRead(req, res, next) {
    try {
        const message = await messagingService.markMessageAsRead(req.params.id, req.user.id);

        res.json({
            success: true,
            message: "Message marqué comme lu",
            data: message
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getConversations,
    getConversationById,
    createConversation,
    getMessages,
    sendMessage,
    markAsRead,
    markMessageAsRead
};
