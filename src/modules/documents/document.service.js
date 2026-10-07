const fs = require("fs");
const path = require("path");
const documentModel = require("./document.model");

// =====================================================================
// document.service.js
// ---------------------------------------------------------------------
// Logique métier du module Documents (pièces d'identité / justificatifs).
// =====================================================================

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    error.statusCode = status;
    error.isOperational = true;
    return error;
}

async function getDocuments(filters) {
    const lim = Math.min(Math.max(parseInt(filters.limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(filters.offset, 10) || 0, 0);

    const [data, total] = await Promise.all([
        documentModel.findDocuments({ ...filters, limit: lim, offset: off }),
        documentModel.countDocuments(filters)
    ]);

    return { data, pagination: { total, limit: lim, offset: off, pages: Math.ceil(total / lim) } };
}

async function getDocumentById(id) {
    const doc = await documentModel.findDocumentById(id);
    if (!doc) throw httpError(404, "Document introuvable.");
    return doc;
}

async function createDocument(authUser, body, file) {
    if (!file) throw httpError(400, "Le fichier est obligatoire (champ multipart « file »).");

    const targetId = body.user_id !== undefined ? Number(body.user_id) : Number(authUser.id);
    if (authUser.role !== "admin" && targetId !== Number(authUser.id)) {
        throw httpError(403, "Vous ne pouvez téléverser un document que pour vous-même.");
    }

    return documentModel.createDocument({
        user_id: targetId,
        doc_type: body.doc_type,
        file_path: file.path
    });
}

async function decide(authUser, id, status) {
    const doc = await getDocumentById(id);
    if (authUser.role !== "admin") {
        throw httpError(403, "Accès interdit — rôle insuffisant.");
    }
    await documentModel.updateStatus(doc.id, status);
    return documentModel.findDocumentById(doc.id);
}

async function remove(authUser, id) {
    const doc = await getDocumentById(id);

    if (authUser.role !== "admin" && Number(doc.user_id) !== Number(authUser.id)) {
        throw httpError(403, "Ce document ne vous appartient pas.");
    }

    // Suppression du fichier sur disque (ignore si déjà absent)
    if (doc.file_path) {
        const abs = path.isAbsolute(doc.file_path)
            ? doc.file_path
            : path.join(process.cwd(), doc.file_path);
        fs.unlink(abs, () => {});
    }

    await documentModel.deleteDocument(doc.id);
    return true;
}

module.exports = {
    getDocuments,
    getDocumentById,
    createDocument,
    decide,
    remove
};
