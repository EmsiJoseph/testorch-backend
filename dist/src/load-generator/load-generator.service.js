"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
let LoadGeneratorService = class LoadGeneratorService {
    loadGenerators = {};
    async spawnLoadGenerator(config) {
        const { remoteServer, dockerImage, lgConfig } = config;
        const command = `ssh ${remoteServer} "docker run -d ${dockerImage} ${lgConfig}"`;
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            throw new Error(`Error spawning Load Generator: ${stderr}`);
        }
        const id = stdout.trim();
        this.loadGenerators[id] = { config, status: "running" };
        return { id, status: "running" };
    }
    async terminateLoadGenerator(id) {
        const lg = this.loadGenerators[id];
        const command = `ssh ${lg.config.remoteServer} "docker stop ${id} && docker rm ${id}"`;
        const { stderr } = await execPromise(command);
        if (stderr) {
            throw new Error(`Error terminating Load Generator: ${stderr}`);
        }
        delete this.loadGenerators[id];
        return { id, status: "terminated" };
    }
    async executeTestPlan(overriddenPlan) {
        const loadGenerators = await this.getLoadGeneratorStatus();
        const command = `ssh ${Object.keys(loadGenerators)[0]} "docker exec -d jmeter -n -t ${overriddenPlan}"`;
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            throw new Error(`Error executing test plan: ${stderr}`);
        }
        return { message: "Test plan executed", stdout };
    }
    async getLoadGeneratorStatus() {
        return this.loadGenerators;
    }
};
exports.LoadGeneratorService = LoadGeneratorService;
exports.LoadGeneratorService = LoadGeneratorService = __decorate([
    (0, common_1.Injectable)()
], LoadGeneratorService);
//# sourceMappingURL=load-generator.service.js.map