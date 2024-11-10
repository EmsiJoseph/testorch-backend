import { JmeterService } from 'src/core/infrastructure/services/jmeter/jmeter.service.js';
import { ITestPlanRepository } from '../interfaces/repositories/test-plan.repository.interface.ts';

export async function startTestPlanV2UseCase(
  testPlanName: string,
  workerNodes: number,
  projectName: string,
  testPlanRepo: ITestPlanRepository,
  jmeterService: JmeterService,
): Promise<any> {
  // Get the JMX URL from the test plan repository
  const jmxUrl = await testPlanRepo.getDownloadUrl(testPlanName, projectName);

  // Delete existing JMeter deployments if they exist
  await jmeterService.deleteJmeterDeploymentsIfExists();

  // Format and deploy JMeter YAMLs
  await jmeterService.formatAndDeployJmeterYamls(
    testPlanName,
    jmxUrl,
    workerNodes,
  );

  return { message: 'Test started successfully' };
}
