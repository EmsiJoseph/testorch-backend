import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";

@Injectable()
export class TeamManagementService {
  private readonly influxUrl = process.env.INFLUX_URL || "";
  private readonly adminToken = process.env.INFLUX_ADMIN_TOKEN || "";
  private readonly logger = new Logger(TeamManagementService.name);

  /**
   * Creates a new team and an associated InfluxDB organization.
   * @param teamName The name of the team to be created.
   * @returns The details of the created team and InfluxDB organization.
   */
  async createTeam(teamName: string): Promise<any> {
    console.log("teamName", teamName);
    // Logic to create the team entity in your application (e.g., save to DB)
    const team = { name: teamName }; // Simulate team creation for demonstration

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
    const orgUrl = `${this.influxUrl}/api/v2/orgs`;

    try {
      const response: AxiosResponse = await axios.post(
        orgUrl,
        { name: orgName },
        { headers: { Authorization: `Token ${this.adminToken}` } },
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
