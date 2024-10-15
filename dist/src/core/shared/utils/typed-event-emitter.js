"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
let TypedEventEmitter = class TypedEventEmitter extends event_emitter_1.EventEmitter2 {
    emit(event, payload) {
        return super.emit(event, payload);
    }
    emitAsync(event, payload) {
        return super.emitAsync(event, payload);
    }
};
exports.TypedEventEmitter = TypedEventEmitter;
exports.TypedEventEmitter = TypedEventEmitter = __decorate([
    (0, common_1.Injectable)()
], TypedEventEmitter);
//# sourceMappingURL=typed-event-emitter.js.map