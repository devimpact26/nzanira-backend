/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const transportModel = require("./transport.model");
const driverService = require("../drivers").driverService;
const vehicleService = require("../vehicles").vehicleService;

function notFound(message) {
    const err = new Error(message);
    err.statusCode = 404;
    return err;
}

function conflict(message) {
    const err = new Error(message);
    err.statusCode = 409;
    return err;
}

function forbidden(message) {
    const err = new Error(message);
    err.statusCode = 403;
    return err;
}

function badRequest(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

// ---------- transport_requests ----------

async function getAllRequests(filters) {
    return transportModel.findAll(filters);
}

async function getRequestById(id) {
    const request = await transportModel.findById(id);
    if (!request) throw notFound("Demande de transport introuvable");
    return request;
}

async function createRequest(data) {
    return transportModel.create(data);
}

async function updateRequest(id, userId, data) {
    const request = await getRequestById(id);

    if (request.requester_id !== userId) {
        throw forbidden("Vous ne pouvez modifier que vos propres demandes");
    }
    if (["delivered", "cancelled"].includes(request.status)) {
        throw conflict("Cette demande ne peut plus être modifiée");
    }

    return transportModel.update(id, data);
}

async function cancelRequest(id, userId) {
    const request = await getRequestById(id);

    if (request.requester_id !== userId) {
        throw forbidden("Vous ne pouvez annuler que vos propres demandes");
    }
    if (["delivered", "cancelled"].includes(request.status)) {
        throw conflict("Cette demande ne peut plus être annulée");
    }

    return transportModel.update(id, { status: "cancelled" });
}

async function deleteRequest(id, userId) {
    const request = await getRequestById(id);

    if (request.requester_id !== userId) {
        throw forbidden("Vous ne pouvez supprimer que vos propres demandes");
    }
    if (request.status !== "published") {
        throw conflict("Seule une demande encore publiée peut être supprimée");
    }

    return transportModel.remove(id);
}

// ---------- request_assignments ----------

async function getAllAssignments(filters) {
    return transportModel.findAssignments(filters);
}

async function getAssignmentById(id) {
    const assignment = await transportModel.findAssignmentById(id);
    if (!assignment) throw notFound("Assignation introuvable");
    return assignment;
}

async function acceptRequest({ request_id, driver_id, vehicle_id }) {
    // 1. La demande doit exister et être encore "published"
    const request = await getRequestById(request_id);
    if (request.status !== "published") {
        throw conflict("Cette demande n'est plus disponible");
    }

    // 2. Le chauffeur doit avoir un profil valide (via le module drivers, pas son model)
    await driverService.getDriverByUserId(driver_id);

    // 3. Le véhicule doit exister et appartenir à ce chauffeur (via le module vehicles)
    const vehicle = await vehicleService.getVehicleById(vehicle_id);
    if (vehicle.driver_id !== driver_id) {
        throw badRequest("Ce véhicule n'appartient pas à ce chauffeur");
    }

    // 4. La demande ne doit pas déjà être assignée (contrainte UNIQUE en base)
    const existing = await transportModel.findAssignmentByRequestId(request_id);
    if (existing) throw conflict("Cette demande a déjà été acceptée par un autre chauffeur");

    // 5. Créer l'assignation + faire passer la demande à "accepted"
    const assignment = await transportModel.createAssignment({ request_id, driver_id, vehicle_id });
    await transportModel.update(request_id, { status: "accepted" });

    return assignment;
}

module.exports = {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    cancelRequest,
    deleteRequest,
    getAllAssignments,
    getAssignmentById,
    acceptRequest,
};
