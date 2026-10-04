const db = require('../../config/db');

const CompanyModel = {
  getAll: async ({ type, search, limit, offset }) => {
    let sql = `SELECT u.id AS user_id, u.full_name, u.phone_number, u.role, u.rating_avg, u.is_verified, u.created_at,
      COALESCE(sp.company_name, op.construction_company) AS company_name,
      sp.business_registry_number, sp.total_orders_supplied, op.total_requests_posted
      FROM users u
      LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
      LEFT JOIN owner_profiles    op ON op.user_id  = u.id
      WHERE u.is_active = 1 AND (u.role = 'fournisseur' OR (u.role = 'proprietaire' AND op.construction_company IS NOT NULL))`;
    const params = [];
    if (type === 'fournisseur' || type === 'proprietaire') { sql += ` AND u.role = ?`; params.push(type); }
    if (search) { sql += ` AND (COALESCE(sp.company_name, op.construction_company) LIKE ? OR u.full_name LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
    sql += ` ORDER BY company_name ASC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  count: async ({ type, search }) => {
    let sql = `SELECT COUNT(*) AS total FROM users u
      LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
      LEFT JOIN owner_profiles    op ON op.user_id  = u.id
      WHERE u.is_active = 1 AND (u.role = 'fournisseur' OR (u.role = 'proprietaire' AND op.construction_company IS NOT NULL))`;
    const params = [];
    if (type === 'fournisseur' || type === 'proprietaire') { sql += ` AND u.role = ?`; params.push(type); }
    if (search) { sql += ` AND COALESCE(sp.company_name, op.construction_company) LIKE ?`; params.push(`%${search}%`); }
    const [rows] = await db.execute(sql, params);
    return rows[0].total;
  },

  findByUserId: async (userId) => {
    const [rows] = await db.execute(
      `SELECT u.id AS user_id, u.full_name, u.phone_number, u.role, u.rating_avg, u.is_verified, u.created_at,
       COALESCE(sp.company_name, op.construction_company) AS company_name,
       sp.business_registry_number, sp.total_orders_supplied, op.total_requests_posted
       FROM users u
       LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
       LEFT JOIN owner_profiles    op ON op.user_id  = u.id
       WHERE u.id = ? AND u.is_active = 1`, [userId]
    );
    return rows[0] || null;
  },

  updateCompanyName: async (userId, role, companyName) => {
    if (role === 'fournisseur') await db.execute(`UPDATE supplier_profiles SET company_name = ? WHERE user_id = ?`, [companyName, userId]);
    else if (role === 'proprietaire') await db.execute(`UPDATE owner_profiles SET construction_company = ? WHERE user_id = ?`, [companyName, userId]);
  },

  updateRegistry: async (userId, registryNumber) => {
    await db.execute(`UPDATE supplier_profiles SET business_registry_number = ? WHERE user_id = ?`, [registryNumber, userId]);
  },

  getUsersByCompany: async (companyName) => {
    const [rows] = await db.execute(
      `SELECT u.id, u.full_name, u.phone_number, u.role, u.is_verified, u.rating_avg FROM users u
       LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
       LEFT JOIN owner_profiles    op ON op.user_id  = u.id
       WHERE u.is_active = 1 AND (sp.company_name LIKE ? OR op.construction_company LIKE ?)
       ORDER BY u.full_name ASC`, [`%${companyName}%`, `%${companyName}%`]
    );
    return rows;
  },

  getOwnerRole: async (userId) => {
    const [rows] = await db.execute(`SELECT id, role FROM users WHERE id = ? AND is_active = 1`, [userId]);
    return rows[0] || null;
  },
};

module.exports = CompanyModel;
