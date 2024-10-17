import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectRepository {
  private readonly githubApiUrl = 'https://api.github.com/repos/AshleyPojol/centralized-testorch-repository/contents/';
  private readonly token = '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';

  constructor(private readonly httpService: HttpService) {}

  async getProjects(team: string, project: string): Promise<any> {
    const path = `teams/${team}/projects`;
    const url = `${this.githubApiUrl}/${path}`;
    
    console.log(`Fetching projects from URL: ${url}`); // Log the URL for troubleshooting

    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }));
      
      console.log('GitHub API response:', response.data); // Log the response

      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error.message); // Log the error
      throw new Error('Failed to fetch projects from GitHub');
    }
  }
  
  async deleteProject(team: string, project: string, sha: string): Promise<any> {
    const path = `teams/${team}/projects/${project}`;
    const url = `${this.githubApiUrl}${path}`;
  
    try {
      // Fetch the contents of the directory first
      console.log(`Fetching contents of the folder at URL: ${url}`);
      const response = await firstValueFrom(this.httpService.get(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }));
  
      const directoryContents = response.data;
  
      // Iterate through the contents and delete each file or directory recursively
      for (const file of directoryContents) {
        const fullPath = file.path;
        if (file.type === 'file') {
          try {
            await this.deleteFile(fullPath, file.sha);
          } catch (error) {
            if (error.response?.status === 404) {
              console.log(`File ${fullPath} not found, skipping.`);
            } else {
              throw error;
            }
          }
        } else if (file.type === 'dir') {
          console.log(`Found a subdirectory: ${fullPath}, deleting contents recursively.`);
          const subdirectorySha = file.sha;
          await this.deleteProject(team, `${project}/${file.name}`, subdirectorySha);
        }
      }
  
      // Once all files and subdirectories are deleted, delete the directory itself
      console.log(`Deleting directory: ${path}`);
      try {
        await this.deleteFile(path, sha);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('Directory not found but files were already deleted. Returning success.');
          return { message: 'Project folder and contents deleted successfully' };
        }
        throw error;
      }
  
      console.log(`Successfully deleted project folder: ${path}`);
      return { message: 'Project folder and contents deleted successfully' };
  
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('Directory not found but files were already deleted. Returning success.');
        return { message: 'Project folder and contents deleted successfully' };
      }
      console.error('Error deleting project:', error.response?.data || error.message);
      return {
        message: 'Failed to delete project from GitHub',
        statusCode: 500
      };
    }
  }
 
  // Helper function to delete a file from GitHub
  async deleteFile(path: string, sha: string): Promise<any> {
    const url = `${this.githubApiUrl}${path}`;
    
    console.log(`Attempting to delete file at URL: ${url} with SHA: ${sha}`);
    
    try {
      const response = await firstValueFrom(this.httpService.delete(url, {
        headers: {
          Authorization: `token ${this.token}`,
        },
        data: {
          message: `Delete ${path}`,
          sha: sha,
        },
      }));
      console.log(`Successfully deleted file: ${path}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error.response?.data || error.message);
      throw new Error(`Failed to delete file: ${path}`);
    }
  }
}
