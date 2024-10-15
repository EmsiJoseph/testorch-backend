"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadGeneratorController = void 0;
const common_1 = require("@nestjs/common");
const load_generator_service_1 = require("./load-generator.service");
let LoadGeneratorController = class LoadGeneratorController {
    loadGeneratorService;
    constructor(loadGeneratorService) {
        this.loadGeneratorService = loadGeneratorService;
    }
    async spawnLoadGenerator(config) {
        return this.loadGeneratorService.spawnLoadGenerator(config);
    }
    async terminateLoadGenerator(id) {
        return this.loadGeneratorService.terminateLoadGenerator(id);
    }
    async getStatus() {
        return this.loadGeneratorService.getLoadGeneratorStatus();
    }
};
exports.LoadGeneratorController = LoadGeneratorController;
__decorate([
    (0, common_1.Post)("spawn"),
    __param(0, (0, common_1.Body)("config")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoadGeneratorController.prototype, "spawnLoadGenerator", null);
__decorate([
    (0, common_1.Delete)("terminate/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoadGeneratorController.prototype, "terminateLoadGenerator", null);
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadGeneratorController.prototype, "getStatus", null);
exports.LoadGeneratorController = LoadGeneratorController = __decorate([
    (0, common_1.Controller)("load-generators"),
    __metadata("design:paramtypes", [load_generator_service_1.LoadGeneratorService])
], LoadGeneratorController);
//# sourceMappingURL=load-generator.controller.js.map