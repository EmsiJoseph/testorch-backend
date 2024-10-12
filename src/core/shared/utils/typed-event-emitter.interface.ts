// typed-event-emitter.interface.ts

import { Events } from './events.interface';

/**
 * Interface for the TypedEventEmitter class.
 */
export interface ITypedEventEmitter {
    /**
     * Type-safe emit method for synchronous event emission.
     * @param event - The name of the event.
     * @param payload - The payload of the event, matching the type defined in Events.
     */
    emit<K extends keyof Events>(event: K, payload: Events[K]): boolean;

    /**
     * Type-safe emitAsync method for asynchronous event emission.
     * @param event - The name of the event.
     * @param payload - The payload of the event, matching the type defined in Events.
     */
    emitAsync<K extends keyof Events>(
        event: K,
        payload: Events[K],
    ): Promise<any[]>;
}
