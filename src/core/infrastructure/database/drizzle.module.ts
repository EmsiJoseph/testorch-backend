import {Module} from '@nestjs/common';
import {PG_CONNECTION} from "../../../constants/auth.constant";
import {db} from "./index";

@Module({
    providers: [
        {
            provide: PG_CONNECTION,
            useValue: db,
        },
    ],
    exports: [PG_CONNECTION],
})
export class DrizzleModule {
}