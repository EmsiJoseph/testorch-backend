import {forwardRef, Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {InfluxdbService} from "./services/influxdb/influxdb.service";
import {GrafanaService} from "./services/grafana/grafana.service";
import {JmeterService} from "./services/jmeter/jmeter.service";
import {KubernetesService} from "./services/kubernetes/kubernetes.service";
import {KubernetesClient} from "./client/kubernetes-client";
import {InfluxdbClient} from "./client/influxdb-client";
import {TeamRepository} from "./repositories/team/team.repository";
import {UsersRepository} from "./repositories/users/users.repository";
import {USERS_REPOSITORY_TOKEN} from "../application/interfaces/repositories/users.repository.interface";
import {DrizzleModule} from "./database/drizzle.module";
import {AuthenticationService} from "./services/auth/authentication.service";

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        forwardRef(() => InfrastructureModule),// Use forwardRef to resolve circular dependencies
        DrizzleModule,
    ],
    providers: [
        InfluxdbService,
        InfluxdbClient, // Register InfluxdbClient as a provider
        KubernetesService,
        GrafanaService,
        JmeterService,
        KubernetesClient,
        TeamRepository,
        AuthenticationService,
        {
            provide: USERS_REPOSITORY_TOKEN,
            useClass: UsersRepository,
        }
    ],
    exports: [
        TeamRepository,
        GrafanaService,
        JmeterService,
        InfluxdbService,
        KubernetesService,
        InfluxdbClient, // Export InfluxdbClient if needed outside this module
        AuthenticationService,
        USERS_REPOSITORY_TOKEN,
    ],
})
export class InfrastructureModule {
}
