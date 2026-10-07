-- =====================================================================
-- Migration 005 : ajout du rôle "admin"
-- ---------------------------------------------------------------------
-- AGENTS.md impose des routes réservées à l'administrateur :
--   PUT /api/users/:id/verify
--   PUT /api/documents/:id/approve
--   PUT /api/documents/:id/reject
--   POST/PUT/DELETE /api/landmarks, /api/materials, /api/vehicle-categories
--
-- Or l'ENUM de la table users ne contient que
--   ('chauffeur','proprietaire','fournisseur')
-- et aucun compte admin ne peut donc exister → ces routes répondaient 403.
--
-- Usage :
--   mysql -u root nzanira < src/migrations/005_add_admin_role.sql
--   node scripts/create-admin.js
-- =====================================================================

ALTER TABLE users
    MODIFY role ENUM('chauffeur','proprietaire','fournisseur','admin')
    NOT NULL;
