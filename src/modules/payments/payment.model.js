const { pool } = require("../../config/database");

// =====================================================================
// payment.model.js
// ---------------------------------------------------------------------
// Tables : `payment_methods` et `transactions`
//
// payment_methods : id, user_id, provider, phone, bank_name,
//                   account_number, is_default, created_at
// transactions    : id, user_id, request_id, method_id, type, amount_fbu,
//                   status, reference, created_at
//
// Enums réels :
//   provider : lumicash | leo | bancobu | bcb | bank
//   type     : publish_fee | driver_fee | refund
//   status   : pending | completed | failed | cancelled
// =====================================================================

// ---------------------------------------------------------------------
// MOYENS DE PAIEMENT
// ---------------------------------------------------------------------

async function findMethods({ user_id, limit, offset }) {
    let sql = `SELECT id, user_id, provider, phone, bank_name, account_number, is_default, created_at
               FROM payment_methods WHERE 1=1`;
    const params = [];

    if (user_id) {
        sql += ` AND user_id = ?`;
        params.push(user_id);
    }

    sql += ` ORDER BY is_default DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function countMethods({ user_id }) {
    let sql = `SELECT COUNT(*) AS total FROM payment_methods WHERE 1=1`;
    const params = [];

    if (user_id) {
        sql += ` AND user_id = ?`;
        params.push(user_id);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0].total;
}

async function findMethodById(id) {
    const [rows] = await pool.execute(
        `SELECT id, user_id, provider, phone, bank_name, account_number, is_default, created_at
         FROM payment_methods WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function createMethod(data) {
    const [result] = await pool.execute(
        `INSERT INTO payment_methods (user_id, provider, phone, bank_name, account_number, is_default)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.user_id,
            data.provider,
            data.phone || null,
            data.bank_name || null,
            data.account_number || null,
            data.is_default ? 1 : 0
        ]
    );
    return await findMethodById(result.insertId);
}

async function updateMethod(id, fields) {
    const allowed = ["provider", "phone", "bank_name", "account_number", "is_default"];
    const updates = [], params = [];

    for (const key of allowed) {
        if (fields[key] !== undefined) {
            updates.push(`${key} = ?`);
            params.push(key === "is_default" ? (fields[key] ? 1 : 0) : fields[key]);
        }
    }

    if (updates.length === 0) return null;

    params.push(id);
    await pool.execute(`UPDATE payment_methods SET ${updates.join(", ")} WHERE id = ?`, params);
    return await findMethodById(id);
}

async function setDefault(id, userId) {
    await pool.execute(`UPDATE payment_methods SET is_default = 0 WHERE user_id = ?`, [userId]);
    const [result] = await pool.execute(
        `UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?`,
        [id, userId]
    );
    return result.affectedRows > 0;
}

async function deleteMethod(id, userId) {
    const [result] = await pool.execute(
        `DELETE FROM payment_methods WHERE id = ? AND user_id = ?`,
        [id, userId]
    );
    return result.affectedRows > 0;
}

// ---------------------------------------------------------------------
// TRANSACTIONS
// ---------------------------------------------------------------------

async function findTransactions({ user_id, type, status, limit, offset }) {
    let sql = `SELECT id, user_id, request_id, method_id, type, amount_fbu, status, reference, created_at
               FROM transactions WHERE 1=1`;
    const params = [];

    if (user_id)  { sql += ` AND user_id = ?`;  params.push(user_id); }
    if (type)     { sql += ` AND type = ?`;     params.push(type); }
    if (status)   { sql += ` AND status = ?`;   params.push(status); }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function countTransactions({ user_id, type, status }) {
    let sql = `SELECT COUNT(*) AS total FROM transactions WHERE 1=1`;
    const params = [];

    if (user_id)  { sql += ` AND user_id = ?`;  params.push(user_id); }
    if (type)     { sql += ` AND type = ?`;     params.push(type); }
    if (status)   { sql += ` AND status = ?`;   params.push(status); }

    const [rows] = await pool.execute(sql, params);
    return rows[0].total;
}

async function findTransactionById(id) {
    const [rows] = await pool.execute(
        `SELECT id, user_id, request_id, method_id, type, amount_fbu, status, reference, created_at
         FROM transactions WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function createTransaction(data) {
    const [result] = await pool.execute(
        `INSERT INTO transactions (user_id, request_id, method_id, type, amount_fbu, status, reference)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            data.user_id,
            data.request_id || null,
            data.method_id || null,
            data.type,
            data.amount_fbu,
            data.status || "pending",
            data.reference || null
        ]
    );
    return await findTransactionById(result.insertId);
}

async function updateTransactionStatus(id, status, reference) {
    const updates = [`status = ?`];
    const params = [status];

    if (reference !== undefined) {
        updates.push(`reference = ?`);
        params.push(reference);
    }

    params.push(id);
    await pool.execute(`UPDATE transactions SET ${updates.join(", ")} WHERE id = ?`, params);
    return await findTransactionById(id);
}

module.exports = {
    findMethods,
    countMethods,
    findMethodById,
    createMethod,
    updateMethod,
    setDefault,
    deleteMethod,
    findTransactions,
    countTransactions,
    findTransactionById,
    createTransaction,
    updateTransactionStatus
};
