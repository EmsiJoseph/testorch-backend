import { Injectable } from "@nestjs/common";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";

@Injectable()
export class TestPlanService {
  async overrideTestPlan(planId: string, overrideConfig: any): Promise<string> {
    const planPath = `/path/to/testplans/${planId}.jmx`; 
    const testPlanXml = await fs.readFile(planPath, "utf8");

    const parser = new xml2js.Parser();
    const builder = new xml2js.Builder();

    const parsedXml = await parser.parseStringPromise(testPlanXml);

 
    if (overrideConfig.threadGroupSize) {
      parsedXml["jmeterTestPlan"]["ThreadGroup"][0]["num_threads"] =
        overrideConfig.threadGroupSize;
    }

  
    if (overrideConfig.rampUpTime) {
      parsedXml["jmeterTestPlan"]["ThreadGroup"][0]["ramp_time"] =
        overrideConfig.rampUpTime;
    }

    const overriddenXml = builder.buildObject(parsedXml);
    
    const overriddenPlanPath = `/path/to/overridden/testplans/${planId}-overridden.jmx`;

    await fs.writeFile(overriddenPlanPath, overriddenXml, "utf8");
    return overriddenPlanPath; 
  }
}
