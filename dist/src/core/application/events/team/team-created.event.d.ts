import { Team } from "../../../domain/models/team";
export declare class TeamCreatedEventPayload implements Pick<Team, "name"> {
    readonly name: string;
    constructor(name: string);
}
