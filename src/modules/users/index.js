const usersController = require("./users.controller");
const usersService = require("./users.service");
const usersModel = require("./users.model");
const usersRoutes = require("./users.routes");
const { createUserSchema, updateUserSchema, queryUserSchema, validate } = require("./users.validator");

module.exports = {
    usersController,
    usersService,
    usersModel,
    usersRoutes,
    usersValidator: {
        createUserSchema,
        updateUserSchema,
        queryUserSchema,
        validate
    }
};
