import { OnModuleInit } from "@nestjs/common";
import { IInfluxdbService } from "../../../application/interfaces/services/influxdb.service.interface";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { InfluxdbClient } from "../../client/influxdb-client";
import { CreateTeamDto } from "../../../presentation/dto/team.dto";
export declare class InfluxdbService implements IInfluxdbService, OnModuleInit {
    private readonly kubernetesService;
    private readonly influxdbClient;
    private readonly logger;
    private readonly namespace;
    private influxdbUrl;
    private influxdbToken;
    private influxdbPassword;
    isFirstDeployment: boolean;
    constructor(kubernetesService: KubernetesService, influxdbClient: InfluxdbClient);
    onModuleInit(): Promise<void>;
    private createInfluxDBSecret;
    deployInfluxdbIfNotExists(): Promise<string>;
    getInfluxdbUrl(): Promise<string>;
    createInfluxdbOrg(createTeamDto: CreateTeamDto): Promise<any>;
    getInfluxdbOrg(): Promise<any>;
    deleteInfluxdbOrg(): Promise<any>;
    listInfluxdbOrgs(): Promise<any>;
    getInfluxdbToken(): Promise<any>;
}
