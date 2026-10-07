const path = require("path");
const fs = require("fs");
const multer = require("multer");
const documentService = require("./document.service");

// =====================================================================
// document.controller.js
// ---------------------------------------------------------------------
// Inclut la configuration multer pour le téléversement multipart
// POST /api/documents  →  champ "file"
// =====================================================================

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const safeExt = path.extname(file.originalname).toLowerCase().slice(0, 10);
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `doc-${unique}${safeExt}`);
    }
});

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED.includes(ext)) {
            return cb(new Error("Type de fichier non autorisé (jpg, png, webp ou pdf)"));
        }
        cb(null, true);
    }
}).single("file");

function sendError(res, err) {
    res.status(err.status || err.statusCode || 500)
       .json({ success: false, message: err.message || "Erreur serveur." });
}

const DocumentController = {

    uploadMiddleware: (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || "Échec du téléversement du fichier."
                });
            }
            next();
        });
    },

    // GET /api/documents
    getDocuments: async (req, res) => {
        try {
            const result = await documentService.getDocuments(req.query);
            res.json({ success: true, ...result });
        } catch (err) { sendError(res, err); }
    },

    // GET /api/documents/:id
    getDocumentById: async (req, res) => {
        try {
            const data = await documentService.getDocumentById(req.params.id);
            res.json({ success: true, data });
        } catch (err) { sendError(res, err); }
    },

    // POST /api/documents (multipart)
    createDocument: async (req, res) => {
        try {
            const data = await documentService.createDocument(req.user, req.body, req.file);
            res.status(201).json({ success: true, message: "Document téléversé.", data });
        } catch (err) { sendError(res, err); }
    },

    // PUT /api/documents/:id/approve
    approve: async (req, res) => {
        try {
            const data = await documentService.decide(req.user, req.params.id, "approved");
            res.json({ success: true, message: "Document approuvé.", data });
        } catch (err) { sendError(res, err); }
    },

    // PUT /api/documents/:id/reject
    reject: async (req, res) => {
        try {
            const data = await documentService.decide(req.user, req.params.id, "rejected");
            res.json({ success: true, message: "Document rejeté.", data });
        } catch (err) { sendError(res, err); }
    },

    // DELETE /api/documents/:id
    deleteDocument: async (req, res) => {
        try {
            await documentService.remove(req.user, req.params.id);
            res.json({ success: true, message: "Document supprimé." });
        } catch (err) { sendError(res, err); }
    }
};

module.exports = DocumentController;
