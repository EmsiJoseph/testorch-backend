import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { forwardRef, Module } from '@nestjs/common';
import { KubernetesClient } from './client/kubernetes-client';
import { GrafanaService } from './services/grafana/grafana.service';
import { InfluxdbService } from './services/influxdb/influxdb.service';
import { JmeterService } from './services/jmeter/jmeter.service';
import { KubernetesService } from './services/kubernetes/kubernetes.service';

import { USERS_REPOSITORY_TOKEN } from '../application/interfaces/repositories/users.repository.interface';
import { InfluxdbClient } from './client/influxdb-client';
import { NestDrizzleModule } from './database/drizzle.module'; // Import GitHubService
import * as schema from './database/schema';
import { ProjectRepository } from './repositories/project/project.repository';
import { TeamRepository } from './repositories/team/team.repository';
import { TestPlanRepository } from './repositories/test-plan/test-plan.repository'; // Import TestPlanRepository
import { TestPlanRepositoryV2 } from './repositories/test-plan/test-plan.repository-v2'; // Import TestPlanRepositoryV2
import { UsersRepository } from './repositories/users/users.repository';
import { Auth0Service } from './services/auth0/auth0.service';
import { GitHubService } from './services/github/github.service';

@Module({
  imports: [
    forwardRef(() => InfrastructureModule), // Use forwardRef to resolve circular dependencies
    HttpModule,
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },
        };
      },
    }),
  ],
  providers: [
    InfluxdbService,
    InfluxdbClient, // Register InfluxdbClient as a provider
    KubernetesService,
    GrafanaService,
    JmeterService,
    KubernetesClient,
    TeamRepository,
    ProjectRepository,
    TestPlanRepository,
    TestPlanRepositoryV2, // Register TestPlanRepositoryV2 as a provider
    GitHubService,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
    UsersRepository,
    Auth0Service,
    TestPlanRepositoryV2, // Register TestPlanService as a provider
  ],
  exports: [
    TeamRepository,
    UsersRepository,
    ProjectRepository,
    GrafanaService,
    JmeterService,
    InfluxdbService,
    KubernetesService,
    InfluxdbClient,
    TestPlanRepository,
    TestPlanRepositoryV2, // Export TestPlanRepositoryV2
    GitHubService,
    USERS_REPOSITORY_TOKEN,
    Auth0Service,
    TestPlanRepositoryV2,
  ],
})
export class InfrastructureModule {}
