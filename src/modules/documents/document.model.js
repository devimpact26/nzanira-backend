const { pool } = require("../../config/database");

// =====================================================================
// document.model.js — table `user_documents`
// ---------------------------------------------------------------------
// Schéma réel : id, user_id, doc_type, file_path, status, uploaded_at
//   doc_type : id_card | passport | driver_license | registry
//   status   : pending  | approved  | rejected
// =====================================================================

async function findDocuments({ user_id, status, doc_type, limit, offset }) {
    let sql = `SELECT id, user_id, doc_type, file_path, status, uploaded_at
               FROM user_documents WHERE 1=1`;
    const params = [];

    if (user_id)  { sql += ` AND user_id = ?`;  params.push(user_id); }
    if (status)   { sql += ` AND status = ?`;   params.push(status); }
    if (doc_type) { sql += ` AND doc_type = ?`; params.push(doc_type); }

    sql += ` ORDER BY uploaded_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function countDocuments({ user_id, status, doc_type }) {
    let sql = `SELECT COUNT(*) AS total FROM user_documents WHERE 1=1`;
    const params = [];

    if (user_id)  { sql += ` AND user_id = ?`;  params.push(user_id); }
    if (status)   { sql += ` AND status = ?`;   params.push(status); }
    if (doc_type) { sql += ` AND doc_type = ?`; params.push(doc_type); }

    const [rows] = await pool.execute(sql, params);
    return rows[0].total;
}

async function findDocumentById(id) {
    const [rows] = await pool.execute(
        `SELECT id, user_id, doc_type, file_path, status, uploaded_at
         FROM user_documents WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function createDocument({ user_id, doc_type, file_path }) {
    const [result] = await pool.execute(
        `INSERT INTO user_documents (user_id, doc_type, file_path) VALUES (?, ?, ?)`,
        [user_id, doc_type, file_path]
    );
    return await findDocumentById(result.insertId);
}

async function updateStatus(id, status) {
    const [result] = await pool.execute(
        `UPDATE user_documents SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result.affectedRows > 0;
}

async function deleteDocument(id) {
    const [result] = await pool.execute(
        `DELETE FROM user_documents WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findDocuments,
    countDocuments,
    findDocumentById,
    createDocument,
    updateStatus,
    deleteDocument
};
