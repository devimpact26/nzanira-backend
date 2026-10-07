// =====================================================================
// scripts/create-admin.js
// ---------------------------------------------------------------------
// Crée (ou met à jour) le compte administrateur nécessaire aux routes
// réservées au rôle "admin" (AGENTS.md) :
//   PUT /api/users/:id/verify
//   PUT /api/documents/:id/approve  |  /reject
//
// Prérequis : migration 005 (voir src/migrations/005_add_admin_role.sql)
//
// Usage :
//   node scripts/create-admin.js
//   ADMIN_PHONE=+25779000001 ADMIN_PASSWORD=MonMotDePasse node scripts/create-admin.js
// =====================================================================

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool, testDatabaseConnection } = require("../src/config/database");

const PHONE = process.env.ADMIN_PHONE || "+25779000001";
const PASSWORD = process.env.ADMIN_PASSWORD;

function randomPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#";
    let out = "";
    for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

async function main() {
    await testDatabaseConnection();

    const password = PASSWORD || randomPassword();
    const hash = await bcrypt.hash(password, 10);

    const [existing] = await pool.execute("SELECT id, full_name, role FROM users WHERE phone = ?", [PHONE]);

    if (existing.length > 0) {
        await pool.execute("UPDATE users SET password_hash = ?, role = 'admin', is_active = 1, is_verified = 1 WHERE id = ?", [hash, existing[0].id]);
        console.log(`✅ Compte admin mis à jour (id=${existing[0].id})`);
    } else {
        const [res] = await pool.execute(
            "INSERT INTO users (full_name, phone, password_hash, role, is_active, is_verified) VALUES (?, ?, ?, 'admin', 1, 1)",
            ["Administrateur NZANAPP", PHONE, hash]
        );
        console.log(`✅ Compte admin créé (id=${res.insertId})`);
    }

    console.log("");
    console.log("   phone    : " + PHONE);
    console.log("   password : " + password);
    if (!PASSWORD) {
        console.log("   (mots de passe généré — définissez ADMIN_PASSWORD pour le fixer)");
    }
    console.log("");

    await pool.end();
}

main().catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
});
