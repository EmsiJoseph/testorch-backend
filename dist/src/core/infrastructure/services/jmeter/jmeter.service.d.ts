import { IJmeterService } from "../../../application/interfaces/services/jmeter.service.interface";
import { KubernetesService } from "../kubernetes/kubernetes.service";
export declare class JmeterService implements IJmeterService {
    private readonly kubernetesService;
    private readonly logger;
    private namespace;
    constructor(kubernetesService: KubernetesService);
    deployJmeterMasterIfNotExists(): Promise<string>;
    deployJmeterSlavesIfNotExists(): Promise<string>;
}
