import { Events } from "./events.interface";
import { OnEventOptions } from "@nestjs/event-emitter/dist/interfaces";
export declare function TypedOnEvent<K extends keyof Events>(eventName: K, options?: OnEventOptions): MethodDecorator;
