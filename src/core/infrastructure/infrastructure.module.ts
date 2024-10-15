import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // Import HttpModule
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
import { TestPlanModule } from '../../test-plan/test-plan.module'; // Import TestPlanModule if it's used in Infrastructure
import { TestPlanRepository } from './repositories/test-plan/test-plan.repository'; // Import TestPlanRepository
import { GitHubService } from './services/github/github.services';  // Import GitHubService



@Module({
    imports: [
        EventEmitterModule.forRoot(),
        forwardRef(() => InfrastructureModule),// Use forwardRef to resolve circular dependencies
        DrizzleModule,
        forwardRef(() => TestPlanModule),  // Use forwardRef to resolve circular dependency
        HttpModule,
    ],
    providers: [
        InfluxdbService,
        InfluxdbClient, // Register InfluxdbClient as a provider
        KubernetesService,
        GrafanaService,
        JmeterService,
        KubernetesClient,
        TeamRepository,
        TestPlanRepository,
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
        AuthenticationService,
        GitHubService,
        USERS_REPOSITORY_TOKEN,
    ],
})
export class InfrastructureModule {
}
