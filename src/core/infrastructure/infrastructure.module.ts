import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  
import {EventEmitterModule} from "@nestjs/event-emitter";
import {InfluxdbService} from "./services/influxdb/influxdb.service";
import {GrafanaService} from "./services/grafana/grafana.service";
import {JmeterService} from "./services/jmeter/jmeter.service";
import {KubernetesService} from "./services/kubernetes/kubernetes.service";
import {AuthenticationService} from "./services/auth/authentication.service";
import {GitHubService} from './services/github/github.services';  
import {KubernetesClient} from "./client/kubernetes-client";
import {InfluxdbClient} from "./client/influxdb-client";
import {TeamRepository} from "./repositories/team/team.repository";
import {ProjectRepository} from './repositories/project/project.repository';
import {UsersRepository} from "./repositories/users/users.repository";
import {TestPlanRepository} from './repositories/test-plan/test-plan.repository'; 
import {USERS_REPOSITORY_TOKEN} from "../application/interfaces/repositories/users.repository.interface";
import {TestPlanModule} from '../../test-plan/test-plan.module'; 
import { ProjectModule } from 'src/project/project.module';
import {DrizzleModule} from "./database/drizzle.module";


@Module({
    imports: [
        EventEmitterModule.forRoot(),
        forwardRef(() => InfrastructureModule),
        DrizzleModule,
        forwardRef(() => TestPlanModule), 
        forwardRef(() => ProjectModule),
        HttpModule,
    ],
    providers: [
        InfluxdbService,
        InfluxdbClient, 
        KubernetesService,
        GrafanaService,
        JmeterService,
        KubernetesClient,
        TeamRepository,
        TestPlanRepository,
        ProjectRepository,
        GitHubService,
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
        InfluxdbClient, 
        TestPlanRepository,
        ProjectRepository,
        AuthenticationService,
        GitHubService,
        USERS_REPOSITORY_TOKEN,
    ],
})
export class InfrastructureModule {
}
