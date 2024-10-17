import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitHubService {
  private readonly githubApiUrl = 'https://api.github.com/repos/AshleyPojol/centralized-testorch-repository/contents';
  private readonly owner = 'AshleyPojol';
  private readonly repo = 'centralized-testorch-repository';
  private readonly token = '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';

  constructor(private readonly httpService: HttpService) {}
  async getTestPlans(team: string, project: string): Promise<any> {
    const path = `teams/${team}/projects/${project}/test-plans`;
    const url = `${this.githubApiUrl}/${path}`;  

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

  async deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any> {
    const path = `teams/${team}/projects/${project}/test-plans/${plan}`;
    const url = `${this.githubApiUrl}/${path}`;
  
    console.log(`Attempting to Delete Test Plan at URL: ${url}`);
    console.log(`Using SHA: ${sha}`);
  
    try {
      const response = await firstValueFrom(this.httpService.delete(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
        data: {
          message: `Delete Test Plan: ${plan}`,
          sha: sha,
        },
      }));
  
      console.log('GitHub API Response:', response.data);
      return response.data;
  
    } catch (error) {
      console.error('Error Deleting Test Plan:', error.response?.data || error.message);
      throw new HttpException('Failed to Delete Test Plan from GitHub', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
