const express = require("express");
const router = express.Router();

const documentController = require("./document.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const {
    validate,
    uploadSchema,
    querySchema
} = require("./document.validator");

// =====================================================================
// Module 14 : Documents — table user_documents
// Toutes les routes sont protégées par JWT (regle d'or #8).
// =====================================================================

// GET /api/documents ?user_id=&status=&doc_type=&limit=&offset=
router.get("/documents",
    authenticate,
    validate(querySchema, "query"),
    documentController.getDocuments
);

// GET /api/documents/:id
router.get("/documents/:id", authenticate, documentController.getDocumentById);

// POST /api/documents — multipart : doc_type + fichier (champ "file")
router.post("/documents",
    authenticate,
    documentController.uploadMiddleware,
    validate(uploadSchema),
    documentController.createDocument
);

// PUT /api/documents/:id/approve — admin
router.put("/documents/:id/approve", authenticate, documentController.approve);

// PUT /api/documents/:id/reject — admin
router.put("/documents/:id/reject", authenticate, documentController.reject);

// DELETE /api/documents/:id — propriétaire ou admin
router.delete("/documents/:id", authenticate, documentController.deleteDocument);

module.exports = router;
