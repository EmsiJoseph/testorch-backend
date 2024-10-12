import {Team} from "../../../domain/models/team";

export class TeamCreatedEventPayload implements Pick<Team, "name"> {
    constructor(public readonly name: string) {
    }
}
