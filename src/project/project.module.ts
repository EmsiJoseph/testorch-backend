import { Module, forwardRef } from '@nestjs/common';
import { InfrastructureModule } from '../core/infrastructure/infrastructure.module';
import { ProjectController } from '../core/presentation/controllers/project.controller';
import { SelectProjectUseCase } from '../core/application/use-cases/select-project.use-case';
import { DeleteProjectUseCase } from '../core/application/use-cases/delete-project.use-case';

@Module({
  imports: [forwardRef(() => InfrastructureModule)],  
  controllers: [ProjectController],
  providers: [SelectProjectUseCase, DeleteProjectUseCase],
})
export class ProjectModule {}
