import { TeamCreatedEventPayload } from "../../application/events/team/team-created.event";
export interface Events {
    "team.created": TeamCreatedEventPayload;
    "team.updated": {
        teamId: string;
        newName: string;
    };
    "team.deleted": {
        teamId: string;
    };
}
