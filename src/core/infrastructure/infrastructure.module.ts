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
import { TestPlanRepositoryV2 } from './repositories/test-plan/test-plan.repository-v2'; // Import TestPlanRepositoryV2
import { UsersRepository } from './repositories/users/users.repository';
import { RecentActivitiesRepository } from './repositories/activities/RecentActivitiesRepository';

import { Auth0Service } from './services/auth0/auth0.service';
import { GitHubService } from './services/github/github.service';
import { SetupService } from './services/setup.service';

@Module({
  imports: [
    forwardRef(() => InfrastructureModule), // Use forwardRef to resolve circular dependencies
    HttpModule,
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL || 'default_database_url',
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
    TestPlanRepositoryV2, // Register TestPlanRepositoryV2 as a provider
    RecentActivitiesRepository,
    GitHubService,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
    UsersRepository,
    Auth0Service,
    TestPlanRepositoryV2, // Register TestPlanService as a provider
    SetupService,
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
    TestPlanRepositoryV2, // Export TestPlanRepositoryV2
    GitHubService,
    RecentActivitiesRepository,
    USERS_REPOSITORY_TOKEN,
    Auth0Service,
    TestPlanRepositoryV2,
    SetupService
  ],
})
export class InfrastructureModule {}
