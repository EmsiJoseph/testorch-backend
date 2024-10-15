export declare enum ROLES {
    'admin' = "admin",
    'observer' = "observer",
    'member' = "member"
}
export declare const SESSION_COOKIE = "auth_session";
export declare const PG_CONNECTION: unique symbol;
export declare const ENTITY_FOUND = "entity was found";
export declare const NO_ENTITY_FOUND = "no entity was found";
export declare const PARAMETERS_FAILED_VALIDATION = "parameters failed validation";
export declare const ENTITY_CREATED = "entity was created";
export declare const ENTITY_ACCEPTED = "entity was accepted";
export declare const INTERNAL_SERVER_ERROR = "internal server error occurred";
export declare const ENTITY_MODIFIED = "entity was modified";
export declare const ENTITY_DELETED = "entity was deleted";
export declare const RESULTS_RETURNED = "results were returned";
export declare const USER_NOT_FOUND = "Unable to get user from User Entity based on userAuthId";
export declare const JKWS_RATE_LIMIT = true;
export declare const JKWS_CACHE = true;
export declare const JKWS_REQUESTS_PER_MINUTE = 10;
export declare const MISSING_AUTH_HEADER = "Missing Authorization Header";
export declare const CONTRACT_API_USER_AUTHORIZATION = "You are not authorized to access this Contract";
export declare const CONTRACT_NOT_EXISTS = "Contract not found with this contract Id or marked for deletion";
export declare const CONTRACT_API_AUTHORIZATION = "Contract APIs can be accessed by Purchaser Admin Only, Please contact Support Team";
export declare const INVOICE_API_USER_AUTHORIZATION = "You are not authorized to access this Contract";
export declare const INVOICE_NOT_EXISTS = "Contract not found with this contract Id or marked for deletion";
export declare const INVALID_AUTH_PROVIDER = "Not Supported Auth provider";
export declare const INVALID_BEARER_TOKEN = "Invalid Authorization token - Token does not match Bearer .*";
export declare const INVALID_AUTH_TOKEN = "Invalid Auth Token";
export declare const DASHBOARD_API_USER_AUTHORIZATION = "You are not authorized to access this Dashboard";
export declare const DASHBOARD_NOT_EXISTS = "Dashboard not found with this Dashboard Id";
export declare const DASHBOARD_API_AUTHORIZATION = "Dashboard APIs can be accessed by Purchaser Admin Only, Please contact Support Team";