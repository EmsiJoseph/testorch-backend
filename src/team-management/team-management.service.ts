import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { KubernetesManagementService } from "../kubernetes-management/kubernetes-management.service";

@Injectable()
export class TeamManagementService {
  private readonly logger = new Logger(TeamManagementService.name);

  private influxdbToken: string;
  private influxdbUrl: string;

  constructor(
    private readonly kubernetestManagementService: KubernetesManagementService,
  ) {
    this.influxdbToken = "e82a5d46-213b-484d-b745-aa01c4791f32";
    this.influxdbUrl = "http://localhost:8086";
  }
  /**
   * Creates a new team and an associated InfluxDB organization.
   * @param teamName The name of the team to be created.
   * @returns The details of the created team and InfluxDB organization.
   */
  async createTeam(teamName: string): Promise<any> {
    // Logic to create the team entity in your application (e.g., save to DB)
    const team = { name: teamName }; // Simulate team creation for demonstration
    this.logger.log(`Influxdburl: ${this.influxdbUrl}`);
    this.logger.log(`InfluxdbToken: ${this.influxdbToken}`);
    // Create the corresponding InfluxDB organization
    const influxOrg = await this.createInfluxDBOrg(teamName);

    // Attach the organization ID to the team object
    team["influxOrgId"] = influxOrg.id;

    // Return the team object with the attached InfluxDB organization
    this.logger.log(
      `Team '${teamName}' created with InfluxDB Org ID: ${influxOrg.id}`,
    );
    return team;
  }

  /**
   * Creates an InfluxDB organization for the given team name.
   * @param orgName The name of the organization to be created in InfluxDB.
   * @returns The created InfluxDB organization object.
   */
  private async createInfluxDBOrg(orgName: string): Promise<any> {
    const orgUrl = `http://localhost:8086/api/v2/orgs`;

    try {
      const response: AxiosResponse = await axios.post(
        orgUrl,
        { name: orgName },
        { headers: { Authorization: `Token ${this.influxdbToken}` } },
      );
      this.logger.log(
        `InfluxDB organization '${orgName}' created with ID: ${response.data.id}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        "Error creating InfluxDB organization:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to create InfluxDB organization");
    }
  }

  /**
   * Placeholder method for deleting a team.
   */
  async deleteTeam(teamId: string): Promise<any> {
    // Implement deletion logic and include related InfluxDB organization deletion
    return { message: `Team with ID ${teamId} deleted.` };
  }

  /**
   * Placeholder method for selecting a team.
   */
  async selectTeam(teamId: string): Promise<any> {
    // Implement logic to fetch and return team details
    return { message: `Selected team with ID ${teamId}.` };
  }

  /**
   * Placeholder method for updating a team.
   */
  async updateTeam(teamId: string, updateDto: any): Promise<any> {
    // Implement logic to update team details and related InfluxDB organization details
    return { message: `Team with ID ${teamId} updated.` };
  }
}
