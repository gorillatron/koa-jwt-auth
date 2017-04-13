

import * as koa                     from 'koa'
import {verify, JsonWebTokenError}  from 'jsonwebtoken'



/*
 * export auth
 * 
 * A koa Middleware that checks the Authorization header and verifies
 * it if it finds a bearer token in it.
 * 
 * Populates IRequestContext.claim with the verified and decoded token
*/

export const authenticated = Symbol("authenticated")

export type AuthOptions = {
  secret: string;
  throws(ctx:koa.Context, error:JsonWebTokenError):Error;
}

export type RequestContext = koa.Context & {
  claim?: any;
}

export const auth = (opts:AuthOptions):koa.Middleware =>
  async (ctx:RequestContext, next) => {
    
    const authHeader = ctx.headers["Authorization"] || 
                       ctx.headers["authorization"]
    
    if(!authHeader)
      return next()

    const elements = authHeader.split(' ')
    const [scheme, token] = elements

    if (scheme === 'Bearer') {
      try {

        ctx.claim = verify(token, opts.secret)
        ctx[authenticated] = true

      } 
      catch(error) {
        
        throw opts.throws(ctx, <JsonWebTokenError> error)
        
      }
    }
    
    return next()

  }


/*
 * export function isAuth
 * Checks if the current request context is authenticated and has a claimed user.
*/

export class NotAuthorizedError extends Error {}

export type IsAuthOptions = {
  throws(ctx:koa.Context, error:NotAuthorizedError):Error;
}

export const isAuth = (opts:IsAuthOptions):koa.Middleware => 
  async (ctx:koa.Context, next) => {

    if(ctx[authenticated]) {

      return next()

    } else {
      throw opts.throws(ctx, new NotAuthorizedError("Request is not authenticated"))
    }

  }