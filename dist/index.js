"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
/*
 * export default auth
 *
 * A koa Middleware that checks the Authorization header and verifies
 * it if it finds a bearer token in it.
 *
 * Populates IRequestContext.claim with the verified and decoded token
*/
exports.authenticated = Symbol("authenticated");
exports.auth = (opts) => (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const authHeader = ctx.headers["Authorization"];
    if (!authHeader)
        return next();
    const elements = authHeader.split(' ');
    const [scheme, token] = elements;
    if (scheme === 'Bearer') {
        try {
            ctx.claim = jsonwebtoken_1.verify(token, opts.secret);
            ctx[exports.authenticated] = true;
        }
        catch (err) {
            const name = err.name;
            const message = name == "JsonWebTokenError" ? "invalid token" :
                name == "TokenExpiredError" ? "expired token" :
                    name == "NotBeforeError" ? "not before error" :
                        "error with token";
            throw opts.throws();
        }
    }
    return next();
});
exports.isAuth = (opts) => (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (ctx[exports.authenticated]) {
        return next();
    }
    else {
        throw opts.throws();
    }
});
