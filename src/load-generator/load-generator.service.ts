import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

@Injectable()
export class LoadGeneratorService {
  private loadGenerators: Record<string, any> = {}; // Store LGs' details

  // Spawn a load generator on a remote server
  async spawnLoadGenerator(config: any): Promise<any> {
    const { remoteServer, dockerImage, lgConfig } = config;
    const command = `ssh ${remoteServer} "docker run -d ${dockerImage} ${lgConfig}"`; // Example command to spawn LG
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error spawning Load Generator: ${stderr}`);
    }

    const id = stdout.trim();
    this.loadGenerators[id] = { config, status: "running" };
    return { id, status: "running" };
  }

  // Terminate a load generator
  async terminateLoadGenerator(id: string): Promise<any> {
    const lg = this.loadGenerators[id];
    const command = `ssh ${lg.config.remoteServer} "docker stop ${id} && docker rm ${id}"`;
    const { stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error terminating Load Generator: ${stderr}`);
    }

    delete this.loadGenerators[id];
    return { id, status: "terminated" };
  }

  // Execute the test plan (potentially overridden)
  async executeTestPlan(overriddenPlan: string): Promise<any> {
    const loadGenerators = await this.getLoadGeneratorStatus();
    const command = `ssh ${Object.keys(loadGenerators)[0]} "docker exec -d jmeter -n -t ${overriddenPlan}"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error executing test plan: ${stderr}`);
    }

    return { message: "Test plan executed", stdout };
  }

  // Get status of all load generators
  async getLoadGeneratorStatus(): Promise<any> {
    return this.loadGenerators;
  }
}
