const deliveryController = require("./delivery.controller");
const deliveryService = require("./delivery.service");
const deliveryModel = require("./delivery.model");
const deliveryRoutes = require("./delivery.routes");
const {
    createDeliverySchema,
    updateDeliverySchema,
    queryDeliverySchema,
    validate
} = require("./delivery.validator");

module.exports = {
    deliveryController,
    deliveryService,
    deliveryModel,
    deliveryRoutes,
    deliveryValidator: {
        createDeliverySchema,
        updateDeliverySchema,
        queryDeliverySchema,
        validate
    }
};
