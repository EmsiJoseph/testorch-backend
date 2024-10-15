"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamUseCase = void 0;
async function createTeamUseCase(createTeamDto, teamRepo, influxdbService) {
    const createdTeam = await teamRepo.createTeam(createTeamDto);
    await influxdbService.createInfluxdbOrg(createdTeam);
    return {
        message: "Team and corresponding InfluxDB organization created successfully",
        teamName: createTeamDto.name,
    };
}
exports.createTeamUseCase = createTeamUseCase;
//# sourceMappingURL=create-team.use-case.js.map