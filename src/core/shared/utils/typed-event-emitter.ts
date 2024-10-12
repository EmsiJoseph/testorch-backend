import {EventEmitter2} from "@nestjs/event-emitter";
import {Injectable} from "@nestjs/common";
import {Events} from "./events.interface";
import {ITypedEventEmitter} from "./typed-event-emitter.interface";

@Injectable()
export class TypedEventEmitter extends EventEmitter2 implements ITypedEventEmitter {
    /**
     * Type-safe emit method for synchronous event emission.
     * @param event - The name of the event.
     * @param payload - The payload of the event, which must match the type defined in TeamEvents.
     */
    emit<K extends keyof Events>(event: K, payload: Events[K]): boolean {
        return super.emit(event, payload);
    }

    /**
     * Type-safe emitAsync method for asynchronous event emission.
     * @param event - The name of the event.
     * @param payload - The payload of the event, which must match the type defined in TeamEvents.
     */
    emitAsync<K extends keyof Events>(
        event: K,
        payload: Events[K],
    ): Promise<any[]> {
        return super.emitAsync(event, payload);
    }
}
