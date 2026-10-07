const paymentModel = require("./payment.model");

// =====================================================================
// payment.service.js
// ---------------------------------------------------------------------
// Logique métier du module Payments (moyens de paiement + transactions).
// =====================================================================

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    error.statusCode = status;
    error.isOperational = true;
    return error;
}

// ---------------------------------------------------------------------
// MOYENS DE PAIEMENT
// ---------------------------------------------------------------------

async function getMethods(filters) {
    const lim = Math.min(Math.max(parseInt(filters.limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(filters.offset, 10) || 0, 0);

    const [data, total] = await Promise.all([
        paymentModel.findMethods({ ...filters, limit: lim, offset: off }),
        paymentModel.countMethods(filters)
    ]);

    return { data, pagination: { total, limit: lim, offset: off, pages: Math.ceil(total / lim) } };
}

async function getMethodById(id) {
    const method = await paymentModel.findMethodById(id);
    if (!method) throw httpError(404, "Moyen de paiement introuvable.");
    return method;
}

async function createMethod(authUser, body) {
    // Spec : l'utilisateur ajoute SON propre moyen de paiement
    const targetId = body.user_id !== undefined ? body.user_id : authUser.id;
    if (authUser.role !== "admin" && Number(targetId) !== Number(authUser.id)) {
        throw httpError(403, "Vous ne pouvez ajouter un moyen de paiement que pour vous-même.");
    }

    const method = await paymentModel.createMethod({ ...body, user_id: targetId });

    // Premier moyen de paiement → automatiquement par défaut
    if (!method.is_default) {
        const { data } = await getMethods({ user_id: targetId, limit: 1, offset: 0 });
        if (data.length === 1) await paymentModel.setDefault(method.id, targetId);
    }

    return paymentModel.findMethodById(method.id);
}

async function updateMethod(authUser, id, body) {
    const method = await getMethodById(id);
    if (authUser.role !== "admin" && Number(method.user_id) !== Number(authUser.id)) {
        throw httpError(403, "Ce moyen de paiement ne vous appartient pas.");
    }
    return paymentModel.updateMethod(id, body);
}

async function setDefaultMethod(authUser, id) {
    const method = await getMethodById(id);
    if (authUser.role !== "admin" && Number(method.user_id) !== Number(authUser.id)) {
        throw httpError(403, "Ce moyen de paiement ne vous appartient pas.");
    }
    await paymentModel.setDefault(id, method.user_id);
    return paymentModel.findMethodById(id);
}

async function deleteMethod(authUser, id) {
    const method = await getMethodById(id);
    if (authUser.role !== "admin" && Number(method.user_id) !== Number(authUser.id)) {
        throw httpError(403, "Ce moyen de paiement ne vous appartient pas.");
    }
    await paymentModel.deleteMethod(id, method.user_id);
    return true;
}

// ---------------------------------------------------------------------
// TRANSACTIONS
// ---------------------------------------------------------------------

async function getTransactions(filters) {
    const lim = Math.min(Math.max(parseInt(filters.limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(filters.offset, 10) || 0, 0);

    const [data, total] = await Promise.all([
        paymentModel.findTransactions({ ...filters, limit: lim, offset: off }),
        paymentModel.countTransactions(filters)
    ]);

    return { data, pagination: { total, limit: lim, offset: off, pages: Math.ceil(total / lim) } };
}

async function getTransactionById(authUser, id) {
    const tx = await paymentModel.findTransactionById(id);
    if (!tx) throw httpError(404, "Transaction introuvable.");
    if (authUser.role !== "admin" && Number(tx.user_id) !== Number(authUser.id)) {
        throw httpError(403, "Cette transaction ne vous appartient pas.");
    }
    return tx;
}

async function createTransaction(authUser, body) {
    const targetId = body.user_id !== undefined ? body.user_id : authUser.id;
    if (authUser.role !== "admin" && Number(targetId) !== Number(authUser.id)) {
        throw httpError(403, "Vous ne pouvez créer une transaction que pour vous-même.");
    }

    if (body.method_id) {
        const method = await paymentModel.findMethodById(body.method_id);
        if (!method) throw httpError(404, "Moyen de paiement introuvable.");
        if (authUser.role !== "admin" && Number(method.user_id) !== Number(targetId)) {
            throw httpError(403, "Ce moyen de paiement ne vous appartient pas.");
        }
    }

    return paymentModel.createTransaction({ ...body, user_id: targetId });
}

async function updateTransactionStatus(authUser, id, status, reference) {
    const tx = await getTransactionById(authUser, id);
    return paymentModel.updateTransactionStatus(tx.id, status, reference);
}

module.exports = {
    getMethods,
    getMethodById,
    createMethod,
    updateMethod,
    setDefaultMethod,
    deleteMethod,
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransactionStatus
};
