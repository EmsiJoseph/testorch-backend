import { Inject, Injectable, Logger } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as fs from 'fs';
import * as path from 'path';
import { DRIZZLE_ORM } from 'src/constants/db.constant';
import { DatabaseOperationError } from 'src/core/domain/errors/common';
import { TestPlanSelectType } from 'src/core/domain/models/test-plan';
import { UploadPlanDto } from 'src/core/presentation/dto/test-plan.dto';
import * as xml2js from 'xml2js';
import { DrizzleService } from '../../database/drizzle.service';
import * as schema from '../../database/schema';
import { testPlans } from '../../database/schema';
import { ITestPlanRepository } from 'src/core/application/interfaces/repositories/test-plan.repository.interface.ts';

@Injectable()
export class TestPlanRepositoryV2 implements ITestPlanRepository {
  private readonly logger = new Logger(TestPlanRepositoryV2.name);

  constructor(
    @Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>,
    private readonly drizzleService: DrizzleService,
  ) {}

  async getTestPlanByName(
    name: string,
  ): Promise<TestPlanSelectType | undefined> {
    try {
      const query = this.conn.query.testPlans.findFirst({
        where: eq(testPlans.name, name),
      });
      return await query.execute();
    } catch (error) {
      this.drizzleService.handlePostgresError(error, 'Test');
    }
  }

  async addTestPlan(
    testPlanName: string,
    location: string,
    createdBy: string,
    projectId: string,
  ): Promise<TestPlanSelectType> {
    try {
      const query = this.conn
        .insert(testPlans)
        .values({
          name: testPlanName,
          location: location,
          created_by: createdBy,
          project_id: projectId,
        })
        .returning();

      const [created] = await query.execute();

      if (created) {
        this.logger.log(`User created: ${created.id}`);
        return created;
      } else {
        throw new DatabaseOperationError('Cannot create user.');
      }
    } catch (error) {
      this.drizzleService.handlePostgresError(error, 'User');
    }
  }

  async getRecentTestPlans(
    projectId: string,
    limit: number,
  ): Promise<TestPlanSelectType[]> {
    try {
      const query = this.conn.query.testPlans.findMany({
        where: eq(testPlans.project_id, projectId),
        orderBy: desc(testPlans.created_at),
        limit: limit,
      });
      return await query.execute();
    } catch (error) {
      this.drizzleService.handlePostgresError(error, 'Test');
    }
  }

  async getTestPlans(
    projectId: string,
  ): Promise<TestPlanSelectType[] | undefined> {
    try {
      const query = this.conn
        .select()
        .from(testPlans)
        .where(eq(testPlans.project_id, projectId));

      const projectList = await query.execute();

      return projectList;
    } catch (error) {
      this.drizzleService.handlePostgresError(error, 'Test');
    }
  }

  async processFile(file: Express.Multer.File): Promise<any> {
    try {
      const filePath = this.getFilePath(file.filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return await this.extractTestData(fileContent);
    } catch (error) {
      this.handleError(error);
    }
  }

  async processBase64File(uploadFileDto: UploadPlanDto): Promise<any> {
    const { file, fileName } = uploadFileDto;
    try {
      const buffer = this.decodeBase64(file);
      const filePath = this.getFilePath(fileName);
      fs.writeFileSync(filePath, buffer);
      const fileContent = buffer.toString('utf-8');
      return await this.extractTestData(fileContent);
    } catch (error) {
      this.handleError(error);
    }
  }

  public getFilePath(fileName: string): string {
    return path.join(__dirname, '../../../../../../uploads', fileName);
  }

  private async extractTestData(fileContent: string): Promise<any> {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(fileContent);

    const findHTTPSamplers = (hashTree: any): any[] => {
      let samplers: any[] = [];
      if (hashTree.HTTPSamplerProxy) {
        samplers = samplers.concat(hashTree.HTTPSamplerProxy);
      }
      if (hashTree.hashTree) {
        hashTree.hashTree.forEach((nestedTree: any) => {
          samplers = samplers.concat(findHTTPSamplers(nestedTree));
        });
      }
      return samplers;
    };

    const httpSamplers = findHTTPSamplers(result.jmeterTestPlan.hashTree[0]);
    const urls = httpSamplers.map((sampler: any) => {
      const domainProp = sampler.stringProp.find(
        (prop: any) => prop.$.name === 'HTTPSampler.domain',
      );
      const pathProp = sampler.stringProp.find(
        (prop: any) => prop.$.name === 'HTTPSampler.path',
      );
      const domain = domainProp ? domainProp._ : undefined;
      const path = pathProp ? pathProp._ : undefined;
      return domain && path ? `http://${domain}${path}` : undefined;
    });

    const urlUndefined = urls.includes(undefined);

    return {
      fullUrls: urls.filter((url: string | undefined) => url !== undefined),
      urlUndefined,
    };
  }

  private decodeBase64(data: string): Buffer {
    const base64Prefix = 'base64,';
    const base64Data = data.includes(base64Prefix)
      ? data.split(base64Prefix)[1]
      : data;
    return Buffer.from(base64Data, 'base64');
  }

  private handleError(error: any): void {
    if (error.code === 'EPERM') {
      this.logger.error(
        'Operation not permitted. Please check your permissions.',
      );
      process.exit(1);
    } else {
      this.logger.error('Error processing file:', error.message);
      throw new Error('Failed to process file.');
    }
  }
}
