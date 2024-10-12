import { OnEvent } from '@nestjs/event-emitter';
import {Events} from "./events.interface";
import {OnEventOptions} from "@nestjs/event-emitter/dist/interfaces";

/**
 * Type-safe @OnEvent decorator that validates the event name and payload type.
 * @param eventName The name of the event, which must match a key in TeamEvents.
 * @param options Options to configure the listener (e.g., async).
 */
export function TypedOnEvent<K extends keyof Events>(
    eventName: K,
    options?: OnEventOptions
): MethodDecorator {
    return OnEvent(eventName, options);
}
