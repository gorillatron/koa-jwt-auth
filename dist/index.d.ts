/// <reference types="koa" />
import * as koa from 'koa';
export declare const authenticated: symbol;
export declare type AuthOpptions = {
    secret: string;
    throws(...args): Error;
};
export declare type RequestContext = koa.Context & {
    claim?: any;
};
export declare const auth: (opts: AuthOpptions) => (context: koa.Context, next: () => Promise<any>) => any;
export declare type IsAuthOptions = {
    throws(...args): Error;
};
export declare const isAuth: (opts: IsAuthOptions) => (context: koa.Context, next: () => Promise<any>) => any;
