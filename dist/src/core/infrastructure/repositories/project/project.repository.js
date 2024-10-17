"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ProjectRepository = class ProjectRepository {
    httpService;
    githubApiUrl = 'https://api.github.com/repos/AshleyPojol/centralized-testorch-repository/contents/';
    token = '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';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getProjects(team, project) {
        const path = `teams/${team}/projects`;
        const url = `${this.githubApiUrl}/${path}`;
        console.log(`Fetching projects from URL: ${url}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            }));
            console.log('GitHub API response:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch projects:', error.message);
            throw new Error('Failed to fetch projects from GitHub');
        }
    }
    async deleteProject(team, project, sha) {
        const path = `teams/${team}/projects/${project}`;
        const url = `${this.githubApiUrl}${path}`;
        try {
            console.log(`Fetching contents of the folder at URL: ${url}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            }));
            const directoryContents = response.data;
            for (const file of directoryContents) {
                const fullPath = file.path;
                if (file.type === 'file') {
                    try {
                        await this.deleteFile(fullPath, file.sha);
                    }
                    catch (error) {
                        if (error.response?.status === 404) {
                            console.log(`File ${fullPath} not found, skipping.`);
                        }
                        else {
                            throw error;
                        }
                    }
                }
                else if (file.type === 'dir') {
                    console.log(`Found a subdirectory: ${fullPath}, deleting contents recursively.`);
                    const subdirectorySha = file.sha;
                    await this.deleteProject(team, `${project}/${file.name}`, subdirectorySha);
                }
            }
            console.log(`Deleting directory: ${path}`);
            try {
                await this.deleteFile(path, sha);
            }
            catch (error) {
                if (error.response?.status === 404) {
                    console.log('Directory not found but files were already deleted. Returning success.');
                    return { message: 'Project folder and contents deleted successfully' };
                }
                throw error;
            }
            console.log(`Successfully deleted project folder: ${path}`);
            return { message: 'Project folder and contents deleted successfully' };
        }
        catch (error) {
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
    async deleteFile(path, sha) {
        const url = `${this.githubApiUrl}${path}`;
        console.log(`Attempting to delete file at URL: ${url} with SHA: ${sha}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(url, {
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
        }
        catch (error) {
            console.error('Error deleting file:', error.response?.data || error.message);
            throw new Error(`Failed to delete file: ${path}`);
        }
    }
};
exports.ProjectRepository = ProjectRepository;
exports.ProjectRepository = ProjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ProjectRepository);
//# sourceMappingURL=project.repository.js.map