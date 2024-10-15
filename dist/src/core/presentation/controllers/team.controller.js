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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_dto_1 = require("../dto/team.dto");
const create_team_use_case_1 = require("../../application/use-cases/create-team.use-case");
const event_emitter_1 = require("@nestjs/event-emitter");
const team_repository_1 = require("../../infrastructure/repositories/team/team.repository");
const influxdb_service_1 = require("../../infrastructure/services/influxdb/influxdb.service");
let TeamController = class TeamController {
    eventEmitter;
    teamRepo;
    influxdbService;
    constructor(eventEmitter, teamRepo, influxdbService) {
        this.eventEmitter = eventEmitter;
        this.teamRepo = teamRepo;
        this.influxdbService = influxdbService;
    }
    async createTeam(createTeamDto) {
        return (0, create_team_use_case_1.createTeamUseCase)(createTeamDto, this.teamRepo, this.influxdbService);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)("create-team"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "createTeam", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)("team-management"),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        team_repository_1.TeamRepository,
        influxdb_service_1.InfluxdbService])
], TeamController);
//# sourceMappingURL=team.controller.js.map