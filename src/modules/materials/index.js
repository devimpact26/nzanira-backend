const materialController = require("./material.controller");
const materialService = require("./material.service");
const materialModel = require("./material.model");
const materialRoutes = require("./material.routes");
const {
    createMaterialSchema,
    updateMaterialSchema,
    validate
} = require("./material.validator");

module.exports = {
    materialController,
    materialService,
    materialModel,
    materialRoutes,
    materialValidator: {
        createMaterialSchema,
        updateMaterialSchema,
        validate
    }
};
