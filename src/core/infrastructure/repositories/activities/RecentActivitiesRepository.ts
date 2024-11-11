  import { Injectable, Inject, Logger } from '@nestjs/common';
  import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
  import { v4 as uuidv4 } from 'uuid';
  import { eq } from 'drizzle-orm';
  import { DRIZZLE_ORM } from '../../../../constants/db.constant';
  import { DrizzleService } from '../../database/drizzle.service';
  import * as schema from '../../database/schema';
  import { RecentActivityDto } from '../../../presentation/dto/recent-activity.dto';
  import { recentActivities } from '../../database/schema';

  @Injectable()
  export class RecentActivitiesRepository {
    private readonly logger = new Logger(RecentActivitiesRepository.name);

    constructor(
      @Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>,
      private readonly drizzleService: DrizzleService,
    ) {}

    // Create a new recent activity
    async createRecentActivity(activity: RecentActivityDto) {
      try {
        const timestamp = activity.timestamp ? new Date(activity.timestamp) : new Date();
    
        if (isNaN(timestamp.getTime())) {
          throw new Error('Invalid timestamp value provided.');
        }
    
        const query = this.conn
          .insert(recentActivities)
          .values({
            id: uuidv4(),
            email: activity.email,
            activity_name: activity.activity_name,
            team_name: activity.team_name,
            auth0_org_id: activity.auth0_org_id,
            project_name: activity.project_name,
            activity_type: activity.activity_type,
            timestamp: timestamp, // Use Date object directly
          })
          .returning();
    
        const [createdActivity] = await query.execute();
    
        if (createdActivity) {
          this.logger.log(`Activity created: ${createdActivity.id}`);
          return createdActivity;
        } else {
          throw new Error('Failed to create activity');
        }
      } catch (error) {
        this.logger.error('Error creating activity:', error);
        throw new Error('DatabaseOperationError: Failed to create recent activity');
      }
    }
    

    // Get recent activities by team name
    async getRecentActivitiesByTeam(teamName: string) {
      try {
        const query = this.conn.query.recentActivities.findMany({
          where: eq(recentActivities.team_name, teamName),
        });
        return await query.execute();
      } catch (error) {
        this.logger.error('Error fetching recent activities:', error);
        throw new Error('DatabaseOperationError: Failed to fetch recent activities');
      }
    }

    
  }
