const { pool: db } = require("../../config/database");

// =====================================================================
// company.model.js — table `companies`
// ---------------------------------------------------------------------
// Schéma RÉEL de la table :
//   id INT UNSIGNED AI | name VARCHAR(150) | registry_doc VARCHAR(255) NULL
//   created_at TIMESTAMP
//
// ATTENTION : l'ancienne version faisait des jointures sur les tables
// `supplier_profiles` et `owner_profiles` qui N'EXISTENT PAS, lisait
// `users.phone_number` (la colonne s'appelle `phone`) et exigeait un
// require('../../config/db') qui provoquait MODULE_NOT_FOUND.
// =====================================================================

const CompanyModel = {

  getAll: async ({ search, limit, offset }) => {
    let sql = `SELECT id, name, registry_doc, created_at FROM companies WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (name LIKE ? OR registry_doc LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
  },

  count: async ({ search }) => {
    let sql = `SELECT COUNT(*) AS total FROM companies WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (name LIKE ? OR registry_doc LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      `SELECT id, name, registry_doc, created_at FROM companies WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  create: async ({ name, registry_doc }) => {
    const [result] = await db.execute(
      `INSERT INTO companies (name, registry_doc) VALUES (?, ?)`,
      [name, registry_doc || null]
    );
    return await CompanyModel.findById(result.insertId);
  },

  update: async (id, fields) => {
    const allowed = ['name', 'registry_doc'];
    const updates = [], params = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) return null;

    params.push(id);
    await db.execute(`UPDATE companies SET ${updates.join(', ')} WHERE id = ?`, params);
    return await CompanyModel.findById(id);
  },

  delete: async (id) => {
    const [result] = await db.execute(`DELETE FROM companies WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },

  // GET /api/companies/:id/drivers
  // Les chauffeurs rattaches a la societe : driver_profiles.company_id
  findDrivers: async (companyId) => {
    const [rows] = await db.execute(
      `SELECT u.id, u.full_name, u.phone, u.is_verified, dp.work_status, dp.created_at AS joined_at
       FROM driver_profiles dp
       JOIN users u ON u.id = dp.user_id
       WHERE dp.company_id = ? AND u.is_active = 1
       ORDER BY u.full_name ASC`,
      [companyId]
    );
    return rows;
  },
};

module.exports = CompanyModel;
