import { TestPlanSelectType } from 'src/core/domain/models/test-plan';

export interface ITestPlanRepository {
  processFile(file: Express.Multer.File): Promise<any>;
  getRecentTestPlans(
    projectId: string,
    limit: number,
  ): Promise<TestPlanSelectType[]>;
  getFilePath(fileName: string): string;
  addTestPlan(
    testPlanName: string,
    location: string,
    createdBy: string,
    projectId: string,
  ): Promise<TestPlanSelectType>;

  getTestPlanByName(name: string): Promise<TestPlanSelectType | undefined>;

  getTestPlans(projectId: string): Promise<TestPlanSelectType[] | undefined>;
}
