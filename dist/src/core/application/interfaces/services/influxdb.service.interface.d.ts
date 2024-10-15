import { CreateTeamDto } from "../../../presentation/dto/team.dto";
export interface IInfluxdbService {
    deployInfluxdbIfNotExists(): Promise<string>;
    createInfluxdbOrg(createTeamDto: CreateTeamDto): Promise<any>;
    getInfluxdbUrl(): Promise<any>;
    getInfluxdbOrg(): Promise<any>;
    deleteInfluxdbOrg(): Promise<any>;
    listInfluxdbOrgs(): Promise<any>;
    getInfluxdbToken(): Promise<any>;
}
