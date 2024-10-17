import { Module, forwardRef  } from '@nestjs/common';
import { InfrastructureModule } from '../core/infrastructure/infrastructure.module'; 
import { TestPlanController } from '../core/presentation/controllers/test-plan.controller';  
import { SelectTestPlanUseCase } from '../core/application/use-cases/select-test-plan.use-case';
import { DeleteTestPlanUseCase } from '../core/application/use-cases/delete-test-plan.use-case';

@Module({
  imports: [forwardRef(() => InfrastructureModule)],  
  controllers: [TestPlanController],
  providers: [SelectTestPlanUseCase, DeleteTestPlanUseCase],
})
export class TestPlanModule {}
