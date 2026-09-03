class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

function errorHandler(err, req, res, next) {
    console.error("Erreur :", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Erreur interne du serveur";

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = { AppError, errorHandler };
