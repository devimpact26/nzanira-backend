const LandmarkModel = require('./landmark.model');

const LandmarkService = {

  getAll: async ({ commune, category, page = 1, limit = 20 }) => {
    const offset = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      LandmarkModel.getAll({ commune, category, limit, offset }),
      LandmarkModel.count({ commune, category }),
    ]);
    return { data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } };
  },

  search: async (q) => {
    if (!q || q.trim().length < 2) throw { status: 400, message: 'Le paramètre q doit avoir au moins 2 caractères.' };
    return LandmarkModel.search(q.trim());
  },

  getNearby: async ({ lat, lng, radius_km = 5, limit = 10 }) => {
    if (!lat || !lng) throw { status: 400, message: 'Les paramètres lat et lng sont requis.' };
    const latitude = parseFloat(lat), longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) throw { status: 400, message: 'lat et lng doivent être des nombres valides.' };
    return LandmarkModel.findNearby({ latitude, longitude, radius_km, limit });
  },

  getOne: async (id) => {
    const landmark = await LandmarkModel.findById(id);
    if (!landmark) throw { status: 404, message: 'Repère introuvable.' };
    return landmark;
  },

  create: async (data) => LandmarkModel.create(data),

  update: async (id, data) => {
    const existing = await LandmarkModel.findById(id);
    if (!existing) throw { status: 404, message: 'Repère introuvable.' };
    return LandmarkModel.update(id, data);
  },

  delete: async (id) => {
    const deleted = await LandmarkModel.delete(id);
    if (!deleted) throw { status: 404, message: 'Repère introuvable.' };
    return true;
  },
};

module.exports = LandmarkService;
