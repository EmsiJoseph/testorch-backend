import {SetMetadata} from '@nestjs/common';
import {ROLES} from "../constants/auth.constant";


export const RolesAllowed = (...roles: ROLES[]) => SetMetadata('roles', roles);