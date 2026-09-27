const LandmarkService = require('./landmark.service');

const LandmarkController = {
  getAll: async (req, res) => {
    try { const result = await LandmarkService.getAll(req.query); res.json({ success: true, ...result }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  search: async (req, res) => {
    try { const data = await LandmarkService.search(req.query.q); res.json({ success: true, data, count: data.length }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  getNearby: async (req, res) => {
    try { const data = await LandmarkService.getNearby(req.query); res.json({ success: true, data, count: data.length }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  getOne: async (req, res) => {
    try { const data = await LandmarkService.getOne(req.params.id); res.json({ success: true, data }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  create: async (req, res) => {
    try { const data = await LandmarkService.create(req.body); res.status(201).json({ success: true, message: 'Repère créé.', data }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  update: async (req, res) => {
    try { const data = await LandmarkService.update(req.params.id, req.body); res.json({ success: true, message: 'Repère mis à jour.', data }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  delete: async (req, res) => {
    try { await LandmarkService.delete(req.params.id); res.json({ success: true, message: 'Repère supprimé.' }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
};

module.exports = LandmarkController;
