const { pool } = require("../../config/database");

// findUsers supports optional filters: role, is_active, phone, full_name (partial)
async function findUsers(filters = {}) {
    let query = `SELECT id, full_name, phone, email, role, lang, theme, gps_enabled, is_verified, is_active, created_at, updated_at FROM users WHERE 1=1`;
    const params = [];

    if (filters.role) {
        query += " AND role = ?";
        params.push(filters.role);
    }
    if (filters.is_active !== undefined) {
        // query param likely string; accept '0'/'1' or boolean-like
        const val = filters.is_active === "0" || filters.is_active === 0 || filters.is_active === "false" ? 0 : 1;
        query += " AND is_active = ?";
        params.push(val);
    }
    if (filters.phone) {
        query += " AND phone = ?";
        params.push(filters.phone);
    }
    if (filters.full_name) {
        query += " AND full_name LIKE ?";
        params.push(`%${filters.full_name}%`);
    }

    query += " ORDER BY created_at DESC";
    const [rows] = await pool.query(query, params);
    return rows;
}

async function findUserById(id) {
    const [rows] = await pool.query(
        `SELECT id, full_name, phone, email, role, lang, theme, gps_enabled, is_verified, is_active, created_at, updated_at FROM users WHERE id = ?`,
        [id]
    );
    return rows[0];
}

async function findUserByPhone(phone) {
    const [rows] = await pool.query(
        `SELECT id, full_name, phone, email, role, lang, theme, gps_enabled, is_verified, is_active, created_at, updated_at FROM users WHERE phone = ?`,
        [phone]
    );
    return rows[0];
}

async function createUser(user) {
    const {
        full_name,
        phone,
        email,
        password_hash,
        role,
        lang,
        theme,
        gps_enabled,
        is_verified,
        is_active
    } = user;

    const [result] = await pool.query(
        `INSERT INTO users (full_name, phone, email, password_hash, role, lang, theme, gps_enabled, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, phone, email, password_hash, role, lang, theme, gps_enabled, is_verified, is_active]
    );

    return await findUserById(result.insertId);
}

async function updateUser(id, updates) {
    const fields = [];
    const values = [];

    // Map allowed update fields - convert password_hash if present
    const allowed = ["full_name", "phone", "email", "password_hash", "role", "lang", "theme", "gps_enabled", "is_verified", "is_active"];

    Object.keys(updates).forEach(key => {
        if (allowed.includes(key) && updates[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    });

    if (fields.length === 0) return null;

    values.push(id);

    const [result] = await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) return null;
    return await findUserById(id);
}

async function deleteUser(id) {
    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findUsers,
    findUserById,
    findUserByPhone,
    createUser,
    updateUser,
    deleteUser
};
