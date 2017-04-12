/// <reference types="koa" />
import * as koa from 'koa';
import { JsonWebTokenError } from 'jsonwebtoken';
export declare const authenticated: symbol;
export declare type AuthOptions = {
    secret: string;
    throws(ctx: koa.Context, error: JsonWebTokenError): Error;
};
export declare type RequestContext = koa.Context & {
    claim?: any;
};
export declare const auth: (opts: AuthOptions) => (context: koa.Context, next: () => Promise<any>) => any;
export declare class NotAuthorizedError extends Error {
}
export declare type IsAuthOptions = {
    throws(ctx: koa.Context, error: NotAuthorizedError): Error;
};
export declare const isAuth: (opts: IsAuthOptions) => (context: koa.Context, next: () => Promise<any>) => any;
