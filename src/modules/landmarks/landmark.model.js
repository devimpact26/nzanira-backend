const { pool: db } = require("../../config/database");

// =====================================================================
// landmark.model.js — table `landmarks`
// ---------------------------------------------------------------------
// Schéma RÉEL de la table :
//   id INT UNSIGNED AI | name VARCHAR(150) | zone VARCHAR(80)
//   lat DECIMAL(9,6) NULL | lng DECIMAL(9,6) NULL | is_active TINYINT(1)
//
// ATTENTION : une version précédente de ce model utilisait les colonnes
// category / commune / latitude / longitude qui N'EXISTENT PAS en base,
// ainsi qu'un require('../../config/db') qui provoquait MODULE_NOT_FOUND.
// =====================================================================

const LandmarkModel = {

  getAll: async ({ zone, is_active, limit, offset }) => {
    let sql = `SELECT id, name, zone, lat, lng, is_active FROM landmarks WHERE 1=1`;
    const params = [];

    if (zone) {
      sql += ` AND zone LIKE ?`;
      params.push(`%${zone}%`);
    }
    if (is_active !== undefined && is_active !== null && is_active !== "") {
      const val = is_active === "0" || is_active === 0 || is_active === "false" ? 0 : 1;
      sql += ` AND is_active = ?`;
      params.push(val);
    }

    sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
  },

  count: async ({ zone, is_active }) => {
    let sql = `SELECT COUNT(*) AS total FROM landmarks WHERE 1=1`;
    const params = [];

    if (zone) {
      sql += ` AND zone LIKE ?`;
      params.push(`%${zone}%`);
    }
    if (is_active !== undefined && is_active !== null && is_active !== "") {
      const val = is_active === "0" || is_active === 0 || is_active === "false" ? 0 : 1;
      sql += ` AND is_active = ?`;
      params.push(val);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      `SELECT id, name, zone, lat, lng, is_active FROM landmarks WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  search: async (q) => {
    const [rows] = await db.execute(
      `SELECT id, name, zone, lat, lng, is_active FROM landmarks
       WHERE name LIKE ? OR zone LIKE ?
       ORDER BY name ASC LIMIT 20`,
      [`%${q}%`, `%${q}%`]
    );
    return rows;
  },

  findNearby: async ({ latitude, longitude, radius_km, limit }) => {
    // lat/lng sont NULLABLE : on les exclut sinon ACOS() renvoie NULL
    const [rows] = await db.execute(
      `SELECT id, name, zone, lat, lng, is_active,
        ROUND(6371 * ACOS(
          LEAST(1.0, GREATEST(-1.0,
            COS(RADIANS(?)) * COS(RADIANS(lat))
            * COS(RADIANS(lng) - RADIANS(?))
            + SIN(RADIANS(?)) * SIN(RADIANS(lat))
          ))
        ), 2) AS distance_km
       FROM landmarks
       WHERE lat IS NOT NULL AND lng IS NOT NULL
       HAVING distance_km <= ?
       ORDER BY distance_km ASC LIMIT ?`,
      [latitude, longitude, latitude, Number(radius_km), Number(limit)]
    );
    return rows;
  },

  create: async ({ name, zone, lat, lng, is_active }) => {
    const [result] = await db.execute(
      `INSERT INTO landmarks (name, zone, lat, lng, is_active) VALUES (?, ?, ?, ?, ?)`,
      [name, zone, lat !== undefined ? lat : null, lng !== undefined ? lng : null,
       is_active === undefined ? 1 : (is_active ? 1 : 0)]
    );
    return await LandmarkModel.findById(result.insertId);
  },

  update: async (id, fields) => {
    const allowed = ['name', 'zone', 'lat', 'lng', 'is_active'];
    const updates = [], params = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(key === 'is_active' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }

    if (updates.length === 0) return null;

    params.push(id);
    await db.execute(`UPDATE landmarks SET ${updates.join(', ')} WHERE id = ?`, params);
    return await LandmarkModel.findById(id);
  },

  delete: async (id) => {
    const [result] = await db.execute(`DELETE FROM landmarks WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = LandmarkModel;
