"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./app/Modules/routes");
const globalerrorHandler_1 = require("./app/Middlewares/globalerrorHandler");
const notFound_1 = __importDefault(require("./app/Middlewares/notFound"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/Config/passport");
const env_1 = require("./app/Config/env");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"], // frontend origin
    credentials: true // if you use cookies (for JWT)
}));
app.use("/api/v1/", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    });
});
app.use(globalerrorHandler_1.GlobalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
