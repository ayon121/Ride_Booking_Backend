"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const user_interface_1 = require("../user/user.interface");
const CheckAuth_1 = require("../../Middlewares/CheckAuth");
const Contactrouter = (0, express_1.Router)();
// POST /api/contact → create new contact
Contactrouter.post("/", contact_controller_1.createContact);
// GET /api/contact → get all contacts
Contactrouter.get("/", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), contact_controller_1.getAllContacts);
exports.default = Contactrouter;
