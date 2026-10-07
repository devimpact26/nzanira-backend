const CompanyService = require('./company.service');

// =====================================================================
// company.controller.js
// ---------------------------------------------------------------------
// Gère les requêtes HTTP du module Companies.
// =====================================================================

const CompanyController = {

  getAll: async (req, res, next) => {
    try {
      const result = await CompanyService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  search: async (req, res, next) => {
    try {
      const data = await CompanyService.search(req.query.q);
      res.json({ success: true, data, count: data.length });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  // GET /api/companies/:id
  getById: async (req, res, next) => {
    try {
      const data = await CompanyService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  // GET /api/companies/:id/drivers
  getDrivers: async (req, res, next) => {
    try {
      const data = await CompanyService.getDrivers(req.params.id);
      res.json({ success: true, data, count: data.length });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  // POST /api/companies
  create: async (req, res, next) => {
    try {
      const data = await CompanyService.create(req.body);
      res.status(201).json({ success: true, message: 'Société créée.', data });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  // PUT /api/companies/:id
  update: async (req, res, next) => {
    try {
      const data = await CompanyService.update(req.params.id, req.body);
      res.json({ success: true, message: 'Société mise à jour.', data });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },

  // DELETE /api/companies/:id
  delete: async (req, res, next) => {
    try {
      await CompanyService.remove(req.params.id);
      res.json({ success: true, message: 'Société supprimée.' });
    } catch (err) {
      res.status(err.status || err.statusCode || 500)
         .json({ success: false, message: err.message || 'Erreur serveur.' });
    }
  },
};

module.exports = CompanyController;
