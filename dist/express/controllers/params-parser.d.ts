import { Request } from 'express';
import { QuotesRequest } from './quotes-request';
export declare class ParametersParser {
    static parse(req: Request): QuotesRequest;
}
