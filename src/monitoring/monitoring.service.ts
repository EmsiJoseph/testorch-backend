import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

@Injectable()
export class MonitoringService {
  private monitoringData: Record<string, any> = {}; // Store monitoring metrics

  async monitorHealth(remoteServer: string): Promise<any> {
    // Command to check LG health (e.g., docker stats on remote server)
    const command = `ssh ${remoteServer} "docker stats --no-stream"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error retrieving LG health: ${stderr}`);
    }

    const stats = stdout.trim();
    this.monitoringData[remoteServer] = { stats };
    return this.monitoringData;
  }

  async sendMetricsToInfluxDB(metrics: any): Promise<any> {
    // Logic to send the monitoring data to InfluxDB
    return { message: "Metrics sent to InfluxDB" };
  }
}
