"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCredentials = void 0;
const Defaults_1 = require("../Defaults");
const setCredentials = (dirname = "_credentials") => {
    Defaults_1.CREDENTIALS.SUFFIX = dirname;
};
exports.setCredentials = setCredentials;
