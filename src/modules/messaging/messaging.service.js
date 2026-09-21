/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// messaging.service.js
// ---------------------------------------------------------------------
// Contient la logique métier pour les conversations et messages:
// validation des autorisations d'accès, gestion du contexte des demandes,
// envoi asynchrone des notifications et mise à jour de l'état de lecture.
// =====================================================================

const messagingModel = require("./messaging.model");
const transportService = require("../transport").transportService;
const usersService = require("../users").usersService;
const notificationService = require("../notifications").notificationService;

function notFound(message) {
    const err = new Error(message);
    err.statusCode = 404;
    err.isOperational = true;
    return err;
}

function forbidden(message) {
    const err = new Error(message);
    err.statusCode = 403;
    err.isOperational = true;
    return err;
}

function badRequest(message) {
    const err = new Error(message);
    err.statusCode = 400;
    err.isOperational = true;
    return err;
}

/**
 * Creer ou obtenir une conversation existante contextuelle a une demande de transport.
 */
async function getOrCreateConversation({ request_id, driver_id, owner_id }, authenticatedUserId) {
    // Audit authorization: caller must be one of the participants
    if (authenticatedUserId !== driver_id && authenticatedUserId !== owner_id) {
        throw forbidden("Vous ne pouvez pas créer une conversation pour d'autres utilisateurs");
    }

    // Verify participants exist
    const driver = await usersService.getUserById(driver_id);
    const owner = await usersService.getUserById(owner_id);

    if (!driver || !owner) {
        throw notFound("Participant introuvable");
    }

    // Check request context if provided
    if (request_id) {
        const request = await transportService.getRequestById(request_id);
        if (!request) {
            throw notFound("Demande de transport introuvable");
        }
        // Ensure owner_id matches requester_id of the demand
        if (request.requester_id !== owner_id) {
            throw badRequest("L'owner spécifié ne correspond pas à l'auteur de la demande");
        }
    }

    // Look for existing conversation to prevent duplicate conversations
    let conversation = await messagingModel.findExistingConversation(request_id, driver_id, owner_id);

    if (!conversation) {
        conversation = await messagingModel.createConversation({ request_id, driver_id, owner_id });
    }

    return conversation;
}

/**
 * Obtenir la liste des conversations de l'utilisateur connecte.
 */
async function getUserConversations(userId) {
    return await messagingModel.findUserConversations(userId);
}

/**
 * Obtenir les details d'une conversation par ID (avec verification d'autorisation).
 */
async function getConversationById(conversationId, userId) {
    const conversation = await messagingModel.findConversationById(conversationId);

    if (!conversation) {
        throw notFound("Conversation introuvable");
    }

    if (conversation.driver_id !== userId && conversation.owner_id !== userId) {
        throw forbidden("Vous n'êtes pas autorisé à accéder à cette conversation");
    }

    return conversation;
}

/**
 * Envoyer un message dans une conversation.
 */
async function sendMessage({ conversation_id, sender_id, content }) {
    if (!content || content.trim().length === 0) {
        throw badRequest("Le contenu du message ne peut pas être vide");
    }

    const conversation = await messagingModel.findConversationById(conversation_id);

    if (!conversation) {
        throw notFound("Conversation introuvable");
    }

    if (conversation.driver_id !== sender_id && conversation.owner_id !== sender_id) {
        throw forbidden("Vous n'êtes pas autorisé à envoyer des messages dans cette conversation");
    }

    const message = await messagingModel.createMessage({
        conversation_id,
        sender_id,
        content: content.trim()
    });

    // Notify recipient asynchronously via Notifications module
    const recipientId = conversation.driver_id === sender_id ? conversation.owner_id : conversation.driver_id;
    const senderName = conversation.driver_id === sender_id ? conversation.driver_name : conversation.owner_name;

    notificationService.sendNotification({
        user_id: recipientId,
        type: "message",
        title: `Nouveau message de ${senderName}`,
        body: content.trim().length > 100 ? `${content.trim().substring(0, 97)}...` : content.trim()
    }).catch(err => {
        console.error("Erreur lors de l'envoi de la notification de message :", err);
    });

    return message;
}

/**
 * Recuperer l'historique des messages d'une conversation.
 */
async function getConversationMessages(conversationId, userId, options = {}) {
    const conversation = await messagingModel.findConversationById(conversationId);

    if (!conversation) {
        throw notFound("Conversation introuvable");
    }

    if (conversation.driver_id !== userId && conversation.owner_id !== userId) {
        throw forbidden("Vous n'êtes pas autorisé à lire les messages de cette conversation");
    }

    // Automatically mark unread messages as read when recipient opens message history
    await messagingModel.markMessagesAsRead(conversationId, userId);

    return await messagingModel.findMessagesByConversation(conversationId, options);
}

/**
 * Marquer explicitement les messages comme lus.
 */
async function markAsRead(conversationId, userId) {
    const conversation = await messagingModel.findConversationById(conversationId);

    if (!conversation) {
        throw notFound("Conversation introuvable");
    }

    if (conversation.driver_id !== userId && conversation.owner_id !== userId) {
        throw forbidden("Vous n'êtes pas autorisé à modifier cette conversation");
    }

    return await messagingModel.markMessagesAsRead(conversationId, userId);
}

module.exports = {
    getOrCreateConversation,
    getUserConversations,
    getConversationById,
    sendMessage,
    getConversationMessages,
    markAsRead
};
