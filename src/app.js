 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

// Route de test
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Bienvenue sur l'API NZANAPP"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} introuvable`
    });
});

// Global error handler
app.use(errorHandler);

module.exports = app;