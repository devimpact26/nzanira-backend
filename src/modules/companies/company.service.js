const CompanyModel = require('./company.model');

// =====================================================================
// company.service.js
// ---------------------------------------------------------------------
// Logique métier du module Companies (sociétés de transport).
// =====================================================================

function httpError(status, message) {
    const error = new Error(message);
    // `status` est lu par le controller, `statusCode` par le errorHandler global
    error.status = status;
    error.statusCode = status;
    error.isOperational = true;
    return error;
}

const CompanyService = {

  getAll: async ({ search, limit, offset }) => {
    // Regle d'or #9 : pagination par defaut ?limit=20&offset=0
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);

    const [data, total] = await Promise.all([
      CompanyModel.getAll({ search, limit: lim, offset: off }),
      CompanyModel.count({ search })
    ]);

    return {
      data,
      pagination: { total, limit: lim, offset: off, pages: Math.ceil(total / lim) }
    };
  },

  search: async (q) => {
    if (!q || q.trim().length < 2) {
      throw httpError(400, 'Le paramètre q doit avoir au moins 2 caractères.');
    }
    return CompanyModel.getAll({ search: q.trim(), limit: 20, offset: 0 });
  },

  getById: async (id) => {
    const company = await CompanyModel.findById(id);
    if (!company) throw httpError(404, 'Société introuvable.');
    return company;
  },

  create: async (data) => {
    const existing = await CompanyModel.getAll({ search: data.name, limit: 100, offset: 0 });
    const duplicate = existing.find(
      (c) => c.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (duplicate) throw httpError(409, 'Une société porte déjà ce nom.');
    return CompanyModel.create(data);
  },

  update: async (id, updates) => {
    const existing = await CompanyModel.findById(id);
    if (!existing) throw httpError(404, 'Société introuvable.');
    return CompanyModel.update(id, updates);
  },

  remove: async (id) => {
    const deleted = await CompanyModel.delete(id);
    if (!deleted) throw httpError(404, 'Société introuvable.');
    return true;
  },

  getDrivers: async (id) => {
    const company = await CompanyModel.findById(id);
    if (!company) throw httpError(404, 'Société introuvable.');
    return CompanyModel.findDrivers(id);
  },
};

module.exports = CompanyService;
