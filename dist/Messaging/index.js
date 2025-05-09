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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMessage = exports.sendTyping =exports.del= exports.sendSticker = exports.sendVoiceNote = exports.sendDocument = exports.sendVideo = exports.sendImage = exports.kickusr = exports.sendTextMessage = void 0;
const Defaults_1 = require("../Defaults");
const Socket_1 = require("../Socket");
const Utils_1 = require("../Utils");
const create_delay_1 = require("../Utils/create-delay");
const is_exist_1 = require("../Utils/is-exist");
const mime_1 = __importDefault(require("mime"));
const Error_1 = require("../Error");
const qrcode = require("qrcode")
const joinGroup = (_a) => __awaiter(void 0, void 0, void 0, function* () {
     var { sessionId, text = ""} = _a, props = __rest(_a, ["sessionId", "text"]);
    const session = (0, Socket_1.getSession)(sessionId);
if (!session) {
        throw new Error_1.SessionNotFound(sessionId);
    
}
   session.groupAcceptInvite(text)
});
exports.joinGroup = joinGroup;
const del = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to = "",id='',sender=''} = _a, props = __rest(_a, ["sessionId", "to","id","sender"]);
   const session = (0, Socket_1.getSession)(sessionId);
if (!session) {
       throw new Error_1.SessionNotFound(sessionId);
   
}
  session.sendMessage(to, { delete: { remoteJid: to,  id: id, participant: sender } })
});
exports.del = del;
const sendTextMessage = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = false,Jid } = _a, props = __rest(_a, ["sessionId", "to", "text", "isGroup","Jid"]);
    const session = (0, Socket_1.getSession)(sessionId);
   
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    return yield session.sendMessage(to, { text:  text,mentions: Jid
    }, {
        quoted: props.answering,
    });
});

exports.sendTextMessage = sendTextMessage;


// Cache sessions to avoid repeated lookups
const sessionCache = new Map();

function getCachedSession(sessionId) {
  let session = sessionCache.get(sessionId);
  if (!session) {
    session = Socket_1.getSession(sessionId);
    if (!session) throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    sessionCache.set(sessionId, session);
  }
  return session;
}

/**
 * Universal sendMessage wrapper for all Baileys message types in JavaScript.
 *
 * @param {string} sessionId   Your multi-session identifier
 * @param {string} jid         Destination JID (user or group) or phone number
 * @param {object} content     AnyMessageContent payload
 * @param {object} [options]   MiscMessageGenerationOptions (quoted, mentions, etc.)
 * @returns {Promise<any>}
 */
async function sendMessage(sessionId, jid, content, options) {
  const session = getCachedSession(sessionId);

  // Convert phone number to JID if needed
  const destJid = jid.includes("@") ? jid : phoneToJid({ to: jid });

  try {
    return await session.sendMessage(destJid, content, options || {});
  } catch (err) {
    // Wrap Baileys errors into WhatsappError for consistency
    throw new Error_1.WhatsappError(
      `Failed to send message to ${destJid}: ${err.message}`,
      { cause: err }
    );
  }
}

exports.sendMessage = sendMessage;

const kickusr = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = true } = _a, props = __rest(_a, ["sessionId", "to", "text",'isGroup']);
    const session = (0, Socket_1.getSession)(sessionId);
   
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    return session.groupParticipantsUpdate(to,[`${text}`],"remove")
});

exports.kickusr = kickusr;


const sendImage = (_b) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = false, media } = _b, props = __rest(_b, ["sessionId", "to", "text", "isGroup", "media"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    if (!media)
        throw new Error_1.WhatsappError("parameter media must be Buffer or String URL");
    return yield session.sendMessage(to, {
        image: typeof media == "string"
            ? {
                url: media,
            }
            : media,
        caption: text,
    }, {
        quoted: props.answering,
    });
});
exports.sendImage = sendImage;
const sendQr = (_b) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = false } = _b, props = __rest(_b, ["sessionId", "to", "text", "isGroup"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
     session.sendMessage(to,{image: { url:  qrcode.toDataURL(text.slice(0, 2048), { scale: 8 })},"fileName":'qrcode.png'}, { quoted: props.answering});
});
exports.sendQr = sendQr;
const sendVideo = (_c) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = false, media } = _c, props = __rest(_c, ["sessionId", "to", "text", "isGroup", "media"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    if (!media)
        throw new Error_1.WhatsappError("parameter media must be Buffer or String URL");
    return yield session.sendMessage(to, {
        video: typeof media == "string"
            ? {
                url: media,
            }
            : media,
        caption: text,
    }, {
        quoted: props.answering,
    });
});
exports.sendVideo = sendVideo;
const sendDocument = (_d) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, text = "", isGroup = false, media, filename } = _d, props = __rest(_d, ["sessionId", "to", "text", "isGroup", "media", "filename"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    if (!media) {
        throw new Error_1.WhatsappError(`Invalid Media`);
    }
    const mimetype = mime_1.default.getType(filename);
    if (!mimetype) {
        throw new Error_1.WhatsappError(`Filename must include valid extension`);
    }
    return yield session.sendMessage(to, {
        fileName: filename,
        document: typeof media == "string"
            ? {
                url: media,
            }
            : media,
        mimetype: mimetype,
        caption: text,
    }, {
        quoted: props.answering,
    });
});
exports.sendDocument = sendDocument;
const gruppeninfo = (_e) => __awaiter(void 0, void 0, void 0, function* () {
  var { sessionId, to, isGroup = false } = _e, props = __rest(_e, ["sessionId", "to","isGroup"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    return yield session.groupMetadata(to);            
})
exports.gruppeninfo = gruppeninfo;
const getAllGroupInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = Socket_1.getAllSessions();
    const groupMetadatas = [];
    for (const session of sessions) {
        const groups = yield session.getAllGroups();
        for (const group of groups) {
            const metadata = yield session.groupMetadata(group);
            groupMetadatas.push(metadata);
        }
    }
    return groupMetadatas;
});
exports.getAllGroupInfo = getAllGroupInfo;

const sendMention = (_e) => __awaiter(void 0, void 0, void 0, function* () {
   var { sessionId, to,text = "",mention = "", isGroup = false } = _e, props = __rest(_e, ["sessionId", "to","text", "mention","isGroup"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    return yield session.sendMessage(to, {
        text: text,
        mentions: mention,
    }, {
        quoted: props.answering,
    });     
})
exports.sendMention = sendMention;

const sendVoiceNote = (_e) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, isGroup = false, media } = _e, props = __rest(_e, ["sessionId", "to", "isGroup", "media"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    if (!media) {
        throw new Error_1.WhatsappError(`Invalid Media`);
    }
    return yield session.sendMessage(to, {
        audio : {url: media},
        fileName: "test" + '.mp3', mimetype: 'audio/mpeg' }, {
        quoted: props.answering,
    });
});
exports.sendVoiceNote = sendVoiceNote;
const sendSticker = (_f) => __awaiter(void 0, void 0, void 0, function* () {
    var { sessionId, to, isGroup, media } = _f, props = __rest(_f, ["sessionId", "to", "isGroup", "media"]);
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    if (!media) {
        throw new Error_1.WhatsappError(`Invalid Media`);
    }
    return yield session.sendMessage(to, {
        sticker: typeof media == "string"
            ? {
                url: media,
            }
            : media,
    }, {
        quoted: props.answering,
    });
});
exports.sendSticker = sendSticker;
/**
 * Give typing effect to target
 *
 * Looks like human typing
 *
 *
 * @param sessionId - Session ID
 * @param to - Target
 * @param duration - Duration in miliseconds typing effect will appear
 */
const sendTyping = ({ sessionId, to, duration = 1000, isGroup = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const oldPhone = to;
    to = (0, Utils_1.phoneToJid)({ to, isGroup });
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    const isRegistered = yield (0, is_exist_1.isExist)({
        sessionId,
        to,
        isGroup,
    });
    if (!isRegistered) {
        throw new Error_1.WhatsappError(`${oldPhone} is not registered on Whatsapp`);
    }
    yield session.sendPresenceUpdate("composing", to);
    yield (0, create_delay_1.createDelay)(duration);
    yield session.sendPresenceUpdate("available", to);
});
exports.sendTyping = sendTyping;
/**
 * Give typing effect to target
 *
 * Looks like human typing
 *
 *
 * @param sessionId - Session ID
 * @param to - Target
 * @param duration - Duration in miliseconds typing effect will appear
 */
const readMessage = ({ sessionId, key }) => __awaiter(void 0, void 0, void 0, function* () {
    const session = (0, Socket_1.getSession)(sessionId);
    if (!session)
        throw new Error_1.WhatsappError(Defaults_1.Messages.sessionNotFound(sessionId));
    yield session.readMessages([key]);
});
exports.readMessage = readMessage;
