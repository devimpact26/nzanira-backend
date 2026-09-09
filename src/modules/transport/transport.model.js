/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const { pool } = require("../../config/database");

// ---------- transport_requests ----------

async function findAll(filters = {}) {
    let sql = `
        SELECT tr.*, m.name AS material_name
        FROM transport_requests tr
        JOIN materials m ON m.id = tr.material_id
        WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
        sql += " AND tr.status = ?";
        params.push(filters.status);
    }
    if (filters.requester_id) {
        sql += " AND tr.requester_id = ?";
        params.push(filters.requester_id);
    }
    if (filters.material_id) {
        sql += " AND tr.material_id = ?";
        params.push(filters.material_id);
    }

    sql += " ORDER BY tr.published_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(
        `SELECT tr.*, m.name AS material_name
         FROM transport_requests tr
         JOIN materials m ON m.id = tr.material_id
         WHERE tr.id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function create(data) {
    const {
        requester_id, material_id, pickup_landmark_id, dest_landmark_id,
        pickup_address, dest_address, quantity_tons, expires_at,
    } = data;

    const [result] = await pool.query(
        `INSERT INTO transport_requests
            (requester_id, material_id, pickup_landmark_id, dest_landmark_id,
             pickup_address, dest_address, quantity_tons, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [requester_id, material_id, pickup_landmark_id || null, dest_landmark_id || null,
         pickup_address || null, dest_address || null, quantity_tons, expires_at || null]
    );
    return findById(result.insertId);
}

async function update(id, { status, pickup_address, dest_address }) {
    await pool.query(
        `UPDATE transport_requests
         SET status = COALESCE(?, status),
             pickup_address = COALESCE(?, pickup_address),
             dest_address = COALESCE(?, dest_address)
         WHERE id = ?`,
        [status || null, pickup_address || null, dest_address || null, id]
    );
    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query(
        "DELETE FROM transport_requests WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

// ---------- request_assignments ----------

async function findAssignments(filters = {}) {
    let sql = "SELECT * FROM request_assignments WHERE 1=1";
    const params = [];

    if (filters.driver_id) {
        sql += " AND driver_id = ?";
        params.push(filters.driver_id);
    }
    if (filters.request_id) {
        sql += " AND request_id = ?";
        params.push(filters.request_id);
    }

    sql += " ORDER BY accepted_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function findAssignmentById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM request_assignments WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

async function findAssignmentByRequestId(requestId) {
    const [rows] = await pool.query(
        "SELECT * FROM request_assignments WHERE request_id = ?",
        [requestId]
    );
    return rows[0] || null;
}

async function createAssignment({ request_id, driver_id, vehicle_id }) {
    const [result] = await pool.query(
        "INSERT INTO request_assignments (request_id, driver_id, vehicle_id) VALUES (?, ?, ?)",
        [request_id, driver_id, vehicle_id]
    );
    return findAssignmentById(result.insertId);
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findAssignments,
    findAssignmentById,
    findAssignmentByRequestId,
    createAssignment,
};
