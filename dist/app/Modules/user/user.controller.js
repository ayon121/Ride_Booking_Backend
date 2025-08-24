"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = exports.getSingleUserByAdmin = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_model_1 = require("./user.model");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.UserServices.createUserService(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "User Created Successfully",
            data: user,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const UpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const decodedToken = req.user;
        const user = yield user_service_1.UserServices.UpdateUserService(payload, decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "User Updated Successfully",
            data: user,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const builder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), req.query);
        builder.filter().search(['name', 'email']).sort().fields().paginate();
        const user = yield builder.build();
        const meta = yield builder.getMeta();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "All User Fetched Successfully",
            data: user,
            meta,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const updateUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        const user = yield user_service_1.UserServices.updateUserByAdminService(userId, updateData);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "User updated successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_service_1.UserServices.getSingleUserByAdminService(userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleUserByAdmin = getSingleUserByAdmin;
// admin analytics
const getAdminAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserServices.getAdminAnalyticsService();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Admin Analytics fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UserControllers = {
    createUser,
    getAllUser,
    UpdateUser,
    // for admin
    updateUserByAdmin,
    getSingleUserByAdmin: exports.getSingleUserByAdmin,
    getAdminAnalytics
};
