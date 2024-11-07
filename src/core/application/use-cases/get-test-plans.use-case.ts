import { ITestPlanRepository } from '../interfaces/repositories/test-plan.repository.interface.ts';
import { IUsersRepository } from '../interfaces/repositories/users.repository.interface';

export async function getTestPlanssUseCase(
  projectId: string,
  testPlanRepo: ITestPlanRepository,
  userRepo: IUsersRepository,
): Promise<any> {
  const testPlans = await testPlanRepo.getTestPlans(projectId);

  const result = await Promise.all(
    testPlans.map(async (testPlan) => {
      const user = await userRepo.getUser(testPlan.created_by);

      return {
        ...testPlan,
        createdByName: user.first_name
          ? `${user.first_name} ${user.last_name}`
          : user.email,
        //   TODO: Implement getRecentTestPlans
        recentExecution: [],
      };
    }),
  );

  return result;
}
