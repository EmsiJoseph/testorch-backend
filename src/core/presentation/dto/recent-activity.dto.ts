export class RecentActivityDto {
  name_user?: string;  // Optional, or use email instead if preferred
  email: string;       // Using email instead of name_user for better accuracy
  activity_name: string;
  timestamp?: Date;
  team_name: string;
  auth0_org_id: string;
  project_name: string;
  activity_type: string;  // Added this property
}
