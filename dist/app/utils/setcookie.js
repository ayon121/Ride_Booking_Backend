"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accesstoken) {
        res.cookie("accesstoken", tokenInfo.accesstoken, {
            httpOnly: true,
            secure: false
        });
    }
    if (tokenInfo.refreshtoken) {
        res.cookie("refreshtoken", tokenInfo.refreshtoken, {
            httpOnly: true,
            secure: false
        });
    }
};
exports.setAuthCookie = setAuthCookie;
