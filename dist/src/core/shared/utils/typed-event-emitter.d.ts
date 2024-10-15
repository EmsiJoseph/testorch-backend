import { EventEmitter2 } from "@nestjs/event-emitter";
import { Events } from "./events.interface";
import { ITypedEventEmitter } from "./typed-event-emitter.interface";
export declare class TypedEventEmitter extends EventEmitter2 implements ITypedEventEmitter {
    emit<K extends keyof Events>(event: K, payload: Events[K]): boolean;
    emitAsync<K extends keyof Events>(event: K, payload: Events[K]): Promise<any[]>;
}
