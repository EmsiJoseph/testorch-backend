"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TeamRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const common_1 = require("@nestjs/common");
let TeamRepository = TeamRepository_1 = class TeamRepository {
    logger = new common_1.Logger(TeamRepository_1.name);
    async createTeam(createTeamDto) {
        this.logger.log(`Creating team ${createTeamDto.name}`);
        this.logger.log(`Stored team ${createTeamDto.name} in database`);
        return { name: createTeamDto.name };
    }
    async getTeam(teamName) {
        console.log(`Getting team ${teamName}`);
    }
    async deleteTeam(teamName) {
        console.log(`Deleting team ${teamName}`);
    }
    async getTeams(userId) {
        console.log(`Getting teams for user ${userId}`);
    }
};
exports.TeamRepository = TeamRepository;
exports.TeamRepository = TeamRepository = TeamRepository_1 = __decorate([
    (0, common_1.Injectable)()
], TeamRepository);
//# sourceMappingURL=team.repository.js.map