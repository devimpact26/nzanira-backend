const paymentService = require("./payment.service");

// =====================================================================
// payment.controller.js
// ---------------------------------------------------------------------
// Gère les requêtes HTTP du module Payments.
// =====================================================================

function sendError(res, err) {
    res.status(err.status || err.statusCode || 500)
       .json({ success: false, message: err.message || "Erreur serveur." });
}

const PaymentController = {

    // --- Moyens de paiement ---
    getMethods: async (req, res) => {
        try {
            const result = await paymentService.getMethods(req.query);
            res.json({ success: true, ...result });
        } catch (err) { sendError(res, err); }
    },

    getMethodById: async (req, res) => {
        try {
            const data = await paymentService.getMethodById(req.params.id);
            res.json({ success: true, data });
        } catch (err) { sendError(res, err); }
    },

    createMethod: async (req, res) => {
        try {
            const data = await paymentService.createMethod(req.user, req.body);
            res.status(201).json({ success: true, message: "Moyen de paiement ajouté.", data });
        } catch (err) { sendError(res, err); }
    },

    updateMethod: async (req, res) => {
        try {
            const data = await paymentService.updateMethod(req.user, req.params.id, req.body);
            res.json({ success: true, message: "Moyen de paiement modifié.", data });
        } catch (err) { sendError(res, err); }
    },

    setDefaultMethod: async (req, res) => {
        try {
            const data = await paymentService.setDefaultMethod(req.user, req.params.id);
            res.json({ success: true, message: "Moyen de paiement défini par défaut.", data });
        } catch (err) { sendError(res, err); }
    },

    deleteMethod: async (req, res) => {
        try {
            await paymentService.deleteMethod(req.user, req.params.id);
            res.json({ success: true, message: "Moyen de paiement supprimé." });
        } catch (err) { sendError(res, err); }
    },

    // --- Transactions ---
    getTransactions: async (req, res) => {
        try {
            const result = await paymentService.getTransactions(req.query);
            res.json({ success: true, ...result });
        } catch (err) { sendError(res, err); }
    },

    getTransactionById: async (req, res) => {
        try {
            const data = await paymentService.getTransactionById(req.user, req.params.id);
            res.json({ success: true, data });
        } catch (err) { sendError(res, err); }
    },

    createTransaction: async (req, res) => {
        try {
            const data = await paymentService.createTransaction(req.user, req.body);
            res.status(201).json({ success: true, message: "Transaction créée.", data });
        } catch (err) { sendError(res, err); }
    },

    updateTransactionStatus: async (req, res) => {
        try {
            const { status, reference } = req.body;
            const data = await paymentService.updateTransactionStatus(
                req.user, req.params.id, status, reference
            );
            res.json({ success: true, message: "Statut de la transaction mis à jour.", data });
        } catch (err) { sendError(res, err); }
    }
};

module.exports = PaymentController;
