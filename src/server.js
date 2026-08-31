 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

require("dotenv").config();

const app = require("./app");
const { testDatabaseConnection } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {

    // Tester la connexion MySQL
    await testDatabaseConnection();

    // Démarrer le serveur
    app.listen(PORT, () => {
        console.log("🚀 Serveur NZANAPP démarré");
        console.log(`🌐 http://localhost:${PORT}`);
    });

}

startServer();