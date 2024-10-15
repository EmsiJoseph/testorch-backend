import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitHubService {
  private readonly githubApiUrl = 'https://api.github.com/repos/AshleyPojol/centralized-testorch-repository/contents';
  private readonly owner = 'AshleyPojol';
  private readonly repo = 'centralized-testorch-repository';
  private readonly token = '';  // Use environment variables for security

  constructor(private readonly httpService: HttpService) {}

  // Fetch the list of test plans for a team and project
  async getTestPlans(team: string, project: string): Promise<any> {
    const path = `teams/${team}/projects/${project}/test-plans`;
    const url = `${this.githubApiUrl}/${path}`;  // Corrected URL

    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }));
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch test plans from GitHub', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a test plan from GitHub
  async deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any> {
    const path = `teams/${team}/projects/${project}/test-plans/${plan}`;
    const url = `${this.githubApiUrl}/${path}`;
  
    console.log(`Attempting to delete test plan at URL: ${url}`);
    console.log(`Using SHA: ${sha}`);
  
    try {
      const response = await firstValueFrom(this.httpService.delete(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
        data: {
          message: `Delete test plan: ${plan}`,
          sha: sha,
        },
      }));
  
      console.log('GitHub API Response:', response.data);
      return response.data;
  
    } catch (error) {
      console.error('Error deleting test plan:', error.response?.data || error.message);
      throw new HttpException('Failed to delete test plan from GitHub', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
