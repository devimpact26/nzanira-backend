/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const { pool } = require("../../config/database");

// ---------- driver_profiles ----------

async function findAll(filters = {}) {
    let sql = `
        SELECT dp.*, u.full_name, u.phone
        FROM driver_profiles dp
        JOIN users u ON u.id = dp.user_id
        WHERE 1=1
    `;
    const params = [];

    if (filters.work_status) {
        sql += " AND dp.work_status = ?";
        params.push(filters.work_status);
    }
    if (filters.company_id) {
        sql += " AND dp.company_id = ?";
        params.push(filters.company_id);
    }

    sql += " ORDER BY dp.created_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function findByUserId(userId) {
    const [rows] = await pool.query(
        "SELECT * FROM driver_profiles WHERE user_id = ?",
        [userId]
    );
    return rows[0] || null;
}

async function findFullProfile(userId) {
    const [rows] = await pool.query(
        `SELECT
            dp.id AS driver_profile_id,
            dp.work_status,
            u.id AS user_id, u.full_name, u.phone,
            c.id AS company_id, c.name AS company_name
         FROM driver_profiles dp
         JOIN users u ON u.id = dp.user_id
         LEFT JOIN companies c ON c.id = dp.company_id
         WHERE dp.user_id = ?`,
        [userId]
    );
    if (!rows[0]) return null;

    const [vehicles] = await pool.query(
        "SELECT * FROM vehicles WHERE driver_id = ?",
        [userId]
    );

    return { ...rows[0], vehicles };
}

async function create({ user_id, work_status, company_id }) {
    const [result] = await pool.query(
        "INSERT INTO driver_profiles (user_id, work_status, company_id) VALUES (?, ?, ?)",
        [user_id, work_status || "independent", company_id || null]
    );
    return findByUserId(user_id);
}

async function update(userId, { work_status, company_id }) {
    await pool.query(
        "UPDATE driver_profiles SET work_status = ?, company_id = ? WHERE user_id = ?",
        [work_status, company_id, userId]
    );
    return findByUserId(userId);
}

async function remove(userId) {
    const [result] = await pool.query(
        "DELETE FROM driver_profiles WHERE user_id = ?",
        [userId]
    );
    return result.affectedRows > 0;
}

// ---------- driver_locations ----------

async function getLatestLocation(userId) {
    const [rows] = await pool.query(
        `SELECT * FROM driver_locations
         WHERE driver_id = ?
         ORDER BY updated_at DESC
         LIMIT 1`,
        [userId]
    );
    return rows[0] || null;
}

async function insertLocation(userId, { lat, lng, speed_kmh }) {
    await pool.query(
        "INSERT INTO driver_locations (driver_id, lat, lng, speed_kmh) VALUES (?, ?, ?, ?)",
        [userId, lat, lng, speed_kmh || null]
    );
    return getLatestLocation(userId);
}

async function findAvailable({ lat, lng, radius_km }) {
    // Formule haversine : distance en km entre 2 points GPS sur la Terre
    const [rows] = await pool.query(
        `SELECT dp.user_id, u.full_name, u.phone, dl.lat, dl.lng,
            (6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(dl.lat)) *
                COS(RADIANS(dl.lng) - RADIANS(?)) +
                SIN(RADIANS(?)) * SIN(RADIANS(dl.lat))
            )) AS distance_km
         FROM driver_profiles dp
         JOIN users u ON u.id = dp.user_id
         JOIN (
             SELECT driver_id, lat, lng
             FROM driver_locations dl1
             WHERE updated_at = (
                 SELECT MAX(updated_at) FROM driver_locations dl2
                 WHERE dl2.driver_id = dl1.driver_id
             )
         ) dl ON dl.driver_id = dp.user_id
         WHERE u.is_active = 1
         HAVING distance_km <= ?
         ORDER BY distance_km ASC`,
        [lat, lng, lat, radius_km || 10]
    );
    return rows;
}

module.exports = {
    findAll,
    findByUserId,
    findFullProfile,
    create,
    update,
    remove,
    getLatestLocation,
    insertLocation,
    findAvailable,
};
