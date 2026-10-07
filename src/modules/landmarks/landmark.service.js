const LandmarkModel = require('./landmark.model');

// =====================================================================
// landmark.service.js
// ---------------------------------------------------------------------
// Logique métier du module Landmarks (points géographiques).
// =====================================================================

function httpError(status, message) {
    const error = new Error(message);
    // `status` est lu par le controller, `statusCode` par le errorHandler global
    error.status = status;
    error.statusCode = status;
    error.isOperational = true;
    return error;
}

const LandmarkService = {

  getAll: async ({ zone, is_active, limit, offset }) => {
    // Regle d'or #9 : pagination par defaut ?limit=20&offset=0
    const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);

    const [data, total] = await Promise.all([
      LandmarkModel.getAll({ zone, is_active, limit: lim, offset: off }),
      LandmarkModel.count({ zone, is_active }),
    ]);

    return {
      data,
      pagination: {
        total,
        limit: lim,
        offset: off,
        pages: Math.ceil(total / lim)
      }
    };
  },

  search: async (q) => {
    if (!q || q.trim().length < 2) {
      throw httpError(400, 'Le paramètre q doit avoir au moins 2 caractères.');
    }
    return LandmarkModel.search(q.trim());
  },

  getNearby: async ({ lat, lng, radius_km, limit }) => {
    if (lat === undefined || lng === undefined) {
      throw httpError(400, 'Les paramètres lat et lng sont requis.');
    }
    return LandmarkModel.findNearby({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radius_km: radius_km || 5,
      limit: limit || 10
    });
  },

  getOne: async (id) => {
    const landmark = await LandmarkModel.findById(id);
    if (!landmark) throw httpError(404, 'Repère introuvable.');
    return landmark;
  },

  create: async (data) => LandmarkModel.create(data),

  update: async (id, data) => {
    const existing = await LandmarkModel.findById(id);
    if (!existing) throw httpError(404, 'Repère introuvable.');
    return LandmarkModel.update(id, data);
  },

  delete: async (id) => {
    const deleted = await LandmarkModel.delete(id);
    if (!deleted) throw httpError(404, 'Repère introuvable.');
    return true;
  },
};

module.exports = LandmarkService;
