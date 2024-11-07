import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitHubService {
  private readonly githubApiUrl: string;
  private readonly owner: string;
  private readonly repo: string;
  private readonly token: string;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.repo = this.configService.get('GITHUB_TEST_PLAN_REPO');
    this.token = this.configService.get('GITHUB_ACCESS_TOKEN');
    this.owner = this.configService.get('GITHUB_TEST_PLAN_REPO_OWNER');
    this.githubApiUrl = this.configService.get('GITHUB_API_URL');
  }

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

  async uploadTestPlan(team: string, project: string, filePath: string, commitMessage: string): Promise<any> {
    const fileName = path.basename(filePath);
    const pathInRepo = `teams/${team}/projects/${project}/test-plans/${fileName}`;

    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const encodedContent = Buffer.from(fileContent).toString('base64'); // Convert to base64

    const url = `${this.githubApiUrl}/${pathInRepo}`;

    try {
      const response = await firstValueFrom(
        this.httpService.put(url,
          {
            message: commitMessage,
            content: encodedContent, // Base64-encoded content
          },
          {
            headers: {
              Authorization: `token ${this.token}`,
            },
          }),
      );

      return response.data;

    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error.message);
      throw new HttpException('Failed to upload file to GitHub', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
