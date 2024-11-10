import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitHubService {
  private githubApiUrl: string | undefined;
  private owner: string | undefined;
  private repo: string | undefined;
  private token: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.githubApiUrl = this.configService.get<string>('GITHUB_API_URL');
    this.owner = this.configService.get<string>('GITHUB_TEST_PLAN_REPO_OWNER');
    this.repo = this.configService.get<string>('GITHUB_TEST_PLAN_REPO');
    this.token = this.configService.get<string>('GITHUB_ACCESS_TOKEN');

  }

  // Fetch the list of test plans for a team and project
  async getTestPlans(team: string, userId: string, project: string): Promise<any> {
    const path = `${userId}/teams/${team}/projects/${project}/test-plans`;
    const url = `${this.githubApiUrl}/${path}`; // Corrected URL

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `token ${this.token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching test plans:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to fetch test plans from GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a test plan from GitHub
  async deleteTestPlan(
    team: string,
    userId: string,
    project: string,
    plan: string,
    sha: string,
  ): Promise<any> {
    const path = `${userId}/teams/${team}/projects/${project}/test-plans/${plan}`;
    const url = `${this.githubApiUrl}/${path}`;


    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, {
          headers: {
            Authorization: `token ${this.token}`,
          },
          data: {
            message: `Delete test plan: ${plan}`,
            sha: sha,
          },
        }),
      );

      console.log('GitHub API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error deleting test plan:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to delete test plan from GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadTestPlan(
    team: string,
    userId: string,
    project: string,
    testPlanName: string,
    fileName: string,
    file: string,
    commitMessage: string,
  ): Promise<any> {
    
    const pathInRepo = `${userId}/teams/${team}/projects/${project}/test-plans/${testPlanName}/${fileName}`;

    const url = `${this.githubApiUrl}${pathInRepo}`;

    try {
      const response = await firstValueFrom(
        this.httpService.put(
          url,
          {
            message: commitMessage,
            content: file, // Base64-encoded content
          },
          {
            headers: {
              Authorization: `token ${this.token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error uploading file:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to upload file to GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
