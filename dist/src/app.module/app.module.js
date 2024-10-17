"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const load_generator_module_1 = require("../load-generator/load-generator.module");
const test_plan_module_1 = require("../test-plan/test-plan.module");
const monitoring_module_1 = require("../monitoring/monitoring.module");
const project_module_1 = require("../project/project.module");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [load_generator_module_1.LoadGeneratorModule, test_plan_module_1.TestPlanModule, monitoring_module_1.MonitoringModule, project_module_1.ProjectModule],
        providers: [websocket_gateway_1.WebsocketGateway, app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map