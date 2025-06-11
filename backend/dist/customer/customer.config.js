"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const customer_service_1 = require("./core/service/customer.service");
const customer_controller_1 = require("./customer.controller");
const customer_repository_1 = require("./customer.repository");
const customerRepository = new customer_repository_1.CustomerRepository();
const customerService = new customer_service_1.CustomerService(customerRepository);
exports.customerController = new customer_controller_1.CustomerController(customerService);
