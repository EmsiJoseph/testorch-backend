
export interface IInfluxdbService {
  deployInfluxdbIfNotExists(): Promise<string>;

  createInfluxdbOrg(orgName: string): Promise<any>;

  createInfluxdbBucket(projectName: string, orgId: string): Promise<any>;

  getInfluxdbUrl(): Promise<any>;

  getInfluxdbOrg(): Promise<any>;

  deleteInfluxdbOrg(): Promise<any>;

  listInfluxdbOrgs(): Promise<any>;

  getInfluxdbToken(): Promise<any>;
}
