import {Module} from "@nestjs/common";
import {InfrastructureModule} from "./core/infrastructure/infrastructure.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {PresentationModule} from "./core/presentation/presentation.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({isGlobal: true}),
        InfrastructureModule,
        PresentationModule,
    ],
})
export class AppModule {
}
