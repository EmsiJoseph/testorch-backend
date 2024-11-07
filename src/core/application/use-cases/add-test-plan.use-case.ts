import { AddTestPlanDto } from 'src/core/presentation/dto/test-plan.dto';
import { ITestPlanRepository } from '../interfaces/repositories/test-plan.repository.interface.ts';
import { IUsersRepository } from '../interfaces/repositories/users.repository.interface.js';

export async function addTestPlanUseCase(
  addTestPlanDto: AddTestPlanDto,
  testPlanRepo: ITestPlanRepository,
  userRepo: IUsersRepository,
): Promise<void> {
  const testPlanExists = await testPlanRepo.getTestPlanByName(
    addTestPlanDto.name,
  );

  if (testPlanExists) {
    throw new Error('Test plan already exists');
  }

  const user = await userRepo.getUserByEmail(addTestPlanDto.email);

  if (!user) {
    throw new Error('User not found');
  }

  const location = testPlanRepo.getFilePath(addTestPlanDto.fileName);
  console.log('Location:', location);
  console.log('fileName:', addTestPlanDto.fileName);

  await testPlanRepo.addTestPlan(
    addTestPlanDto.name,
    location,
    user.id,
    addTestPlanDto.projectId,
  );

  return;
}
