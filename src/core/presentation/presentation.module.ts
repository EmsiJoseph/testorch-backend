import {Module} from "@nestjs/common";
import {TeamController} from "./controllers/team.controller";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";
import {AuthController} from "./controllers/auth.controller";

@Module({
    imports: [InfrastructureModule],
    controllers: [TeamController, AuthController],
})
export class PresentationModule {
}
