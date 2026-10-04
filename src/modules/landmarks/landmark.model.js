const db = require('../../config/db');

const LandmarkModel = {

  getAll: async ({ commune, category, limit, offset }) => {
    let sql = `SELECT * FROM landmarks WHERE 1=1`;
    const params = [];
    if (commune)  { sql += ` AND commune LIKE ?`;  params.push(`%${commune}%`); }
    if (category) { sql += ` AND category LIKE ?`; params.push(`%${category}%`); }
    sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  count: async ({ commune, category }) => {
    let sql = `SELECT COUNT(*) AS total FROM landmarks WHERE 1=1`;
    const params = [];
    if (commune)  { sql += ` AND commune LIKE ?`;  params.push(`%${commune}%`); }
    if (category) { sql += ` AND category LIKE ?`; params.push(`%${category}%`); }
    const [rows] = await db.execute(sql, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await db.execute(`SELECT * FROM landmarks WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  search: async (q) => {
    const [rows] = await db.execute(
      `SELECT * FROM landmarks WHERE name LIKE ? OR commune LIKE ? ORDER BY name ASC LIMIT 20`,
      [`%${q}%`, `%${q}%`]
    );
    return rows;
  },

  findNearby: async ({ latitude, longitude, radius_km, limit }) => {
    const [rows] = await db.execute(
      `SELECT *, ROUND(6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(latitude))
        * COS(RADIANS(longitude) - RADIANS(?))
        + SIN(RADIANS(?)) * SIN(RADIANS(latitude))
      ), 2) AS distance_km
      FROM landmarks
      HAVING distance_km <= ?
      ORDER BY distance_km ASC LIMIT ?`,
      [latitude, longitude, latitude, Number(radius_km), Number(limit)]
    );
    return rows;
  },

  create: async ({ name, category, commune, latitude, longitude }) => {
    const [result] = await db.execute(
      `INSERT INTO landmarks (name, category, commune, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
      [name, category || null, commune || null, latitude, longitude]
    );
    const [rows] = await db.execute(`SELECT * FROM landmarks WHERE id = ?`, [result.insertId]);
    return rows[0];
  },

  update: async (id, fields) => {
    const allowed = ['name', 'category', 'commune', 'latitude', 'longitude'];
    const updates = [], params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) { updates.push(`${key} = ?`); params.push(fields[key]); }
    }
    if (updates.length === 0) return null;
    params.push(id);
    await db.execute(`UPDATE landmarks SET ${updates.join(', ')} WHERE id = ?`, params);
    const [rows] = await db.execute(`SELECT * FROM landmarks WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  delete: async (id) => {
    const [result] = await db.execute(`DELETE FROM landmarks WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = LandmarkModel;
