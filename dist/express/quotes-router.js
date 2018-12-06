"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quotes_controller_1 = require("./controllers/quotes-controller");
const params_validator_1 = require("./controllers/params-validator");
exports.router = express_1.Router();
const quotesController = new quotes_controller_1.QuotesController();
exports.router.get('/', [
    params_validator_1.ParametersValidator.validate,
    quotesController.handle.bind(quotesController)
]);
exports.router.get('/:asset', [
    params_validator_1.ParametersValidator.validate,
    quotesController.handle.bind(quotesController)
]);
exports.default = exports.router;
