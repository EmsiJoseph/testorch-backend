import { Events } from './events.interface';
export interface ITypedEventEmitter {
    emit<K extends keyof Events>(event: K, payload: Events[K]): boolean;
    emitAsync<K extends keyof Events>(event: K, payload: Events[K]): Promise<any[]>;
}
