import { PaginatedMeta } from "types/pagination";

export enum StatusCode {
    BAD_REQUEST = "BAD_REQUEST", //400
    UNAUTHORIZED = "UNAUTHENTICATED", //401
    MISSING_RESOURCE = "MISSING_RESOURCE", //404
    RATE_LIMIT = "RATE_LIMIT", //429
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR", //500
    SUCCESS = "SUCCESS", //200
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
}

export interface ErrorInfo {
    message: string;
    code: string;
}
export interface FieldState {
    identifier: string;
    errors: ErrorInfo[];
}

export interface ResponseMeta {
    paginationInfo?: PaginatedMeta;
    error?: any;
}

export interface Response<T> {
    status: boolean;
    errorDetail?: FieldState[];
    message?: string;
    statusCode: StatusCode;
    data: T;
    meta?: ResponseMeta;
}

export const formatResponse = <T>(
    data: T,
    statusCode: StatusCode = StatusCode.SUCCESS,
    other?: Omit<Response<T>, "data" | "statusCode" | "status">,
): Response<T> => {
    const resp: Response<T> = {
        data: data,
        statusCode: statusCode,
        status: statusCode === StatusCode.SUCCESS ? true : false,
        meta: {},
    };
    if (other) {
        if (other.meta && other.meta.paginationInfo) {
            resp.meta && (resp.meta.paginationInfo = other.meta.paginationInfo);
        }
        if (other.errorDetail && other.errorDetail.length > 0) {
            resp.errorDetail = other.errorDetail;
            resp.status = false;
            resp.statusCode = statusCode;
        }
    }
    return resp;
};
