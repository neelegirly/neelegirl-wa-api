import { Socket } from "../Socket/Socket";
import { WhatsappOptions } from "../Types/WhatsappOptions";
export declare class Whatsapp {
    constructor(options?: WhatsappOptions);
    sockets: Map<string, Socket>;
    callback: Map<string, Function>;
    retryCount: Map<string, number>;
    load(each?: (socket: Socket) => Socket): Promise<void>;
    private shouldLoadSession;
    private getSocket;
    startSession: (socket: Socket) => Promise<Socket>;
    private isSessionExistAndRunning;
    deleteSession: (sessionId: string) => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map