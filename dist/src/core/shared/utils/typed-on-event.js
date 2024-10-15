"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedOnEvent = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
function TypedOnEvent(eventName, options) {
    return (0, event_emitter_1.OnEvent)(eventName, options);
}
exports.TypedOnEvent = TypedOnEvent;
//# sourceMappingURL=typed-on-event.js.map