/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const transportService = require("./transport.service");

// ---------- transport_requests ----------

async function getRequests(req, res, next) {
    try {
        const filters = {
            status: req.query.status,
            requester_id: req.query.requester_id,
            material_id: req.query.material_id,
        };
        const requests = await transportService.getAllRequests(filters);
        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
}

async function getRequestById(req, res, next) {
    try {
        const request = await transportService.getRequestById(req.params.id);
        res.json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
}

async function createRequest(req, res, next) {
    try {
        const data = { ...req.body, requester_id: req.user.id };
        const request = await transportService.createRequest(data);
        res.status(201).json({
            success: true,
            message: "Demande de transport publiée",
            data: request,
        });
    } catch (error) {
        next(error);
    }
}

async function updateRequest(req, res, next) {
    try {
        const request = await transportService.updateRequest(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json({ success: true, message: "Demande mise à jour", data: request });
    } catch (error) {
        next(error);
    }
}

async function cancelRequest(req, res, next) {
    try {
        const request = await transportService.cancelRequest(req.params.id, req.user.id);
        res.json({ success: true, message: "Demande annulée", data: request });
    } catch (error) {
        next(error);
    }
}

async function deleteRequest(req, res, next) {
    try {
        await transportService.deleteRequest(req.params.id, req.user.id);
        res.json({ success: true, message: "Demande supprimée" });
    } catch (error) {
        next(error);
    }
}

// ---------- request_assignments ----------

async function getAssignments(req, res, next) {
    try {
        const filters = {
            driver_id: req.query.driver_id,
            request_id: req.query.request_id,
        };
        const assignments = await transportService.getAllAssignments(filters);
        res.json({ success: true, data: assignments });
    } catch (error) {
        next(error);
    }
}

async function getAssignmentById(req, res, next) {
    try {
        const assignment = await transportService.getAssignmentById(req.params.id);
        res.json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
}

async function acceptRequest(req, res, next) {
    try {
        const data = { ...req.body, driver_id: req.user.id };
        const assignment = await transportService.acceptRequest(data);
        res.status(201).json({
            success: true,
            message: "Demande acceptée",
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    cancelRequest,
    deleteRequest,
    getAssignments,
    getAssignmentById,
    acceptRequest,
};
