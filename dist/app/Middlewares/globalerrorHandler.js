"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const env_1 = require("../Config/env");
const AppError_1 = __importDefault(require("../ErrorHelpers/AppError"));
const GlobalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = `Something Went Wrong!!${err.message} From Global Error`;
    // Duplicate Error
    if (err.code === 11000) {
        statusCode = 400;
        const duplicatearray = err.mesaage.match(/"([^"]*)"/);
        message = `${duplicatearray[1]} already Exits`;
    }
    // Cast Error / Object Error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Object Id , Please Provide Valid Id";
    }
    else if (err.name === "ZodError") {
        statusCode = 400;
        message = "ZodError";
    }
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error Occoured";
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: env_1.envVars.NODE_ENV == "development" ? err.stack : null
    });
};
exports.GlobalErrorHandler = GlobalErrorHandler;
