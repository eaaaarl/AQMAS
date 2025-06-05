"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queerController = void 0;
const queer_service_1 = require("./core/service/queer.service");
const queer_controller_1 = require("./queer.controller");
const queer_repository_1 = require("./queer.repository");
const queerRepository = new queer_repository_1.QueerRepository();
const queerService = new queer_service_1.QueerService(queerRepository);
exports.queerController = new queer_controller_1.QueerController(queerService);
