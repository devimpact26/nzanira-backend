const CompanyModel = require('./company.model');

const CompanyService = {
  getAll: async ({ type, search, page = 1, limit = 20 }) => {
    const offset = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([CompanyModel.getAll({ type, search, limit, offset }), CompanyModel.count({ type, search })]);
    return { data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } };
  },
  search: async (q) => {
    if (!q || q.trim().length < 2) throw { status: 400, message: 'Le paramètre q doit avoir au moins 2 caractères.' };
    return CompanyModel.getAll({ search: q.trim(), limit: 10, offset: 0 });
  },
  getOne: async (userId) => {
    const company = await CompanyModel.findByUserId(userId);
    if (!company) throw { status: 404, message: 'Entreprise introuvable.' };
    return company;
  },
  update: async (userId, requesterId, requesterRole, { company_name, business_registry_number }) => {
    if (requesterRole !== 'admin' && requesterId !== userId) throw { status: 403, message: 'Accès refusé.' };
    const user = await CompanyModel.getOwnerRole(userId);
    if (!user) throw { status: 404, message: 'Utilisateur introuvable.' };
    if (company_name) await CompanyModel.updateCompanyName(userId, user.role, company_name);
    if (business_registry_number && user.role === 'fournisseur') await CompanyModel.updateRegistry(userId, business_registry_number);
    return CompanyModel.findByUserId(userId);
  },
  getUsers: async (userId, requesterId, requesterRole) => {
    if (requesterRole !== 'admin' && requesterId !== userId) throw { status: 403, message: 'Accès refusé.' };
    const company = await CompanyModel.findByUserId(userId);
    if (!company || !company.company_name) throw { status: 404, message: 'Entreprise introuvable.' };
    return CompanyModel.getUsersByCompany(company.company_name);
  },
};

module.exports = CompanyService;
