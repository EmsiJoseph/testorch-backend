"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
let MonitoringService = class MonitoringService {
    monitoringData = {};
    async monitorHealth(remoteServer) {
        const command = `ssh ${remoteServer} "docker stats --no-stream"`;
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            throw new Error(`Error retrieving LG health: ${stderr}`);
        }
        const stats = stdout.trim();
        this.monitoringData[remoteServer] = { stats };
        return this.monitoringData;
    }
    async sendMetricsToInfluxDB(metrics) {
        return { message: "Metrics sent to InfluxDB" };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)()
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map