"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whatsapp = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const Defaults_1 = require("../Defaults");
const Socket_1 = require("../Socket/Socket");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Error_1 = require("../Error");
const pino_1 = __importDefault(require("pino"));
const message_status_1 = require("../Utils/message-status");
const save_media_1 = require("../Utils/save-media");
class Whatsapp {
    constructor(options = {}) {
        this.sockets = new Map();
        this.callback = new Map();
        this.retryCount = new Map();
        this.shouldLoadSession = (socket) => {
            if (fs_1.default.existsSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME)) &&
                fs_1.default.existsSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX)) &&
                fs_1.default.readdirSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX)).length &&
                !this.getSocket(socket.id)) {
                return true;
            }
            return false;
        };
        this.getSocket = (key) => { var _a; return (_a = this.sockets.get(key)) !== null && _a !== void 0 ? _a : null; };
        this.startSession = (socket) => __awaiter(this, void 0, void 0, function* () {
            if (this.isSessionExistAndRunning(socket))
                throw new Error_1.WhatsappError(Defaults_1.Messages.sessionAlreadyExist(socket.id));
            const logger = (0, pino_1.default)({ level: "silent" });
            const { version } = yield (0, baileys_1.fetchLatestBaileysVersion)();
            const startSocket = () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX));
                const sock = (0, baileys_1.default)({
                    version,
                    auth: {
                        creds: state.creds,
                        keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
                    },
                    logger,
                    markOnlineOnConnect: false,
                    browser: baileys_1.Browsers.ubuntu("Chrome"),
                });
                socket.socket = sock;
                this.sockets.set(socket.id, socket);
                try {
                    sock.ev.process((events) => __awaiter(this, void 0, void 0, function* () {
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        if (events["connection.update"]) {
                            const update = events["connection.update"];
                            const { connection, lastDisconnect } = update;
                            if (update.qr) {
                                (_b = socket.onQr) === null || _b === void 0 ? void 0 : _b.call(socket, update.qr);
                            }
                            if (connection == "connecting") {
                                (_c = socket.onConnecting) === null || _c === void 0 ? void 0 : _c.call(socket);
                            }
                            if (connection === "close") {
                                const code = (_e = (_d = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode;
                                let retryAttempt = (_f = this.retryCount.get(socket.id)) !== null && _f !== void 0 ? _f : 0;
                                let shouldRetry;
                                if (code != baileys_1.DisconnectReason.loggedOut && retryAttempt < 10) {
                                    shouldRetry = true;
                                }
                                if (shouldRetry) {
                                    retryAttempt++;
                                }
                                if (shouldRetry) {
                                    this.retryCount.set(socket.id, retryAttempt);
                                    startSocket();
                                }
                                else {
                                    this.retryCount.delete(socket.id);
                                    this.deleteSession(socket.id);
                                    (_g = socket.onDisconnected) === null || _g === void 0 ? void 0 : _g.call(socket);
                                }
                            }
                            if (connection == "open") {
                                this.retryCount.delete(socket.id);
                                (_h = socket.onConnected) === null || _h === void 0 ? void 0 : _h.call(socket);
                            }
                        }
                        if (events["creds.update"]) {
                            yield saveCreds();
                        }
                        if (events["messages.update"]) {
                            const msg = events["messages.update"][0];
                            const data = Object.assign({ sessionId: socket.id, messageStatus: (0, message_status_1.parseMessageStatusCodeToReadable)(msg.update.status) }, msg);
                            (_j = socket.onMessageUpdated) === null || _j === void 0 ? void 0 : _j.call(socket, data);
                        }
                        if (events["messages.upsert"]) {
                            const msg = (_k = events["messages.upsert"]
                                .messages) === null || _k === void 0 ? void 0 : _k[0];
                            msg.sessionId = socket.id;
                            msg.saveImage = (path) => (0, save_media_1.saveImageHandler)(msg, path);
                            msg.saveVideo = (path) => (0, save_media_1.saveVideoHandler)(msg, path);
                            msg.saveDocument = (path) => (0, save_media_1.saveDocumentHandler)(msg, path);
                            (_l = socket.onMessageReceived) === null || _l === void 0 ? void 0 : _l.call(socket, msg);
                        }
                    }));
                    if (!sock.authState.creds.registered) {
                        yield new Promise((resolve) => setTimeout(resolve, 5000));
                        const code = yield sock.requestPairingCode(socket.phoneNumber);
                        console.log(code);
                        (_a = socket.onPairing) === null || _a === void 0 ? void 0 : _a.call(socket, code);
                    }
                    return socket;
                }
                catch (error) {
                    console.log(error.message);
                    return socket;
                }
            });
            return startSocket();
        });
        this.isSessionExistAndRunning = (socket) => {
            if (fs_1.default.existsSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME)) &&
                fs_1.default.existsSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX)) &&
                fs_1.default.readdirSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX)).length &&
                this.getSocket(socket.id)) {
                return true;
            }
            return false;
        };
        this.deleteSession = (sessionId) => __awaiter(this, void 0, void 0, function* () {
            const socket = this.getSocket(sessionId);
            if (!socket)
                return;
            yield socket.logout();
            const dir = path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME, socket.id + "_" + socket.phoneNumber + Defaults_1.CREDENTIALS.SUFFIX);
            if (fs_1.default.existsSync(dir)) {
                fs_1.default.rmSync(dir, { force: true, recursive: true });
            }
        });
    }
    load(each) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME))) {
                fs_1.default.mkdirSync(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME));
            }
            fs_1.default.readdir(path_1.default.resolve(Defaults_1.CREDENTIALS.DIR_NAME), (err, dirs) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (err) {
                    throw err;
                }
                for (const dir of dirs) {
                    const sessionId = dir.split("_")[0];
                    const phoneNumber = dir.split("_")[1];
                    let socket = new Socket_1.Socket({
                        id: sessionId,
                        phoneNumber: phoneNumber,
                    });
                    socket = (_a = each === null || each === void 0 ? void 0 : each(socket)) !== null && _a !== void 0 ? _a : socket;
                    if (!this.shouldLoadSession(socket))
                        continue;
                    this.startSession(socket);
                }
            }));
        });
    }
}
exports.Whatsapp = Whatsapp;
const wa = new Whatsapp();
// wa.load();
const mySocket = new Socket_1.Socket({ id: "mysocket", phoneNumber: "6281524538841" });
mySocket.onPairing = (code) => {
    console.log(code);
};
wa.startSession(mySocket);
