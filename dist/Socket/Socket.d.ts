import { WASocket } from "@whiskeysockets/baileys";
import { MessageReceived, MessageUpdated } from "../Types";
export declare class Socket {
    constructor({ id, phoneNumber, socket, }: {
        id: string;
        phoneNumber: string;
        socket?: WASocket;
    });
    id: string;
    socket: WASocket | undefined;
    phoneNumber: string;
    logout(): Promise<void>;
    onQr?: (qr: string) => void;
    onPairing?: (code: string) => void;
    onConnecting?: () => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
    onMessageUpdated?: (data: MessageUpdated) => void;
    onMessageReceived?: (data: MessageReceived) => void;
}
//# sourceMappingURL=Socket.d.ts.map