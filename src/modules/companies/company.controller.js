const CompanyService = require('./company.service');

const CompanyController = {
  getAll: async (req, res) => {
    try { const result = await CompanyService.getAll(req.query); res.json({ success: true, ...result }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  search: async (req, res) => {
    try { const data = await CompanyService.search(req.query.q); res.json({ success: true, data, count: data.length }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  getOne: async (req, res) => {
    try { const data = await CompanyService.getOne(req.params.userId); res.json({ success: true, data }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  update: async (req, res) => {
    try { const data = await CompanyService.update(req.params.userId, req.user.id, req.user.role, req.body); res.json({ success: true, message: 'Entreprise mise à jour.', data }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
  getUsers: async (req, res) => {
    try { const data = await CompanyService.getUsers(req.params.userId, req.user.id, req.user.role); res.json({ success: true, data, count: data.length }); }
    catch (err) { res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' }); }
  },
};

module.exports = CompanyController;
