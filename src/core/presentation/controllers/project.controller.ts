  import { Controller, Get, Delete, Param } from '@nestjs/common';
  import { SelectProjectUseCase } from '../../../core/application/use-cases/select-project.use-case';
  import { DeleteProjectUseCase } from '../../../core/application/use-cases/delete-project.use-case';

  @Controller('project')
  export class ProjectController {
    constructor(
      private readonly selectProjectUseCase: SelectProjectUseCase,
      private readonly deleteProjectUseCase: DeleteProjectUseCase,
    ) {
      console.log('⭐ ProjectController initialized');
    }

    @Get('select/:team/:project')
    async selectProject(@Param('team') team: string, @Param('project') project: string) {
      return this.selectProjectUseCase.execute(team, project);
  }


    @Delete('delete/:team/:project/:sha')
    async deleteProject(
      @Param('team') team: string,
      @Param('project') project: string,
      @Param('sha') sha: string,
    ) {
      return this.deleteProjectUseCase.execute(team, project, sha);
    } 

  }
