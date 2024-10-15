"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPlanService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const xml2js = require("xml2js");
let TestPlanService = class TestPlanService {
    async overrideTestPlan(planId, overrideConfig) {
        const planPath = `/path/to/testplans/${planId}.jmx`;
        const testPlanXml = await fs.readFile(planPath, "utf8");
        const parser = new xml2js.Parser();
        const builder = new xml2js.Builder();
        const parsedXml = await parser.parseStringPromise(testPlanXml);
        if (overrideConfig.threadGroupSize) {
            parsedXml["jmeterTestPlan"]["ThreadGroup"][0]["num_threads"] =
                overrideConfig.threadGroupSize;
        }
        if (overrideConfig.rampUpTime) {
            parsedXml["jmeterTestPlan"]["ThreadGroup"][0]["ramp_time"] =
                overrideConfig.rampUpTime;
        }
        const overriddenXml = builder.buildObject(parsedXml);
        const overriddenPlanPath = `/path/to/overridden/testplans/${planId}-overridden.jmx`;
        await fs.writeFile(overriddenPlanPath, overriddenXml, "utf8");
        return overriddenPlanPath;
    }
};
exports.TestPlanService = TestPlanService;
exports.TestPlanService = TestPlanService = __decorate([
    (0, common_1.Injectable)()
], TestPlanService);
//# sourceMappingURL=test-plan.service.js.map