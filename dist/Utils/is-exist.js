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
exports.isExist = void 0;
const Error_1 = require("../Error");
const Socket_1 = require("../Socket");
const phone_to_jid_1 = require("./phone-to-jid");
const isExist = ({ sessionId, to, isGroup = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const session = (0, Socket_1.getSession)(sessionId);
        if (!session)
            throw new Error_1.WhatsappError("Session ID Not Found!");
        const receiver = (0, phone_to_jid_1.phoneToJid)({
            to: to,
            isGroup: isGroup,
        });
        if (!isGroup) {
            const one = Boolean((_b = (_a = (yield (session === null || session === void 0 ? void 0 : session.onWhatsApp(receiver)))) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.exists);
            return one;
        }
        else {
            return Boolean((yield session.groupMetadata(receiver)).id);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.isExist = isExist;
