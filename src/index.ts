

import * as koa               from 'koa'
import {verify}               from 'jsonwebtoken'



/*
 * export default auth
 * 
 * A koa Middleware that checks the Authorization header and verifies
 * it if it finds a bearer token in it.
 * 
 * Populates IRequestContext.claim with the verified and decoded token
*/

export const authenticated = Symbol("authenticated")

export type AuthOpptions = {
  secret: string;
  throws(...args):Error;
}

export type RequestContext = koa.Context & {
  claim?: any;
}

export const auth = (opts:AuthOpptions):koa.Middleware =>
  async (ctx:RequestContext, next) => {
    
    const authHeader = ctx.headers["Authorization"]
    
    if(!authHeader)
      return next()

    const elements = authHeader.split(' ')
    const [scheme, token] = elements

    if (scheme === 'Bearer') {
      try {

        ctx.claim = verify(token, opts.secret)
        ctx[authenticated] = true

      } 
      catch(err) {

        const name = err.name

        const message = 
            name == "JsonWebTokenError" ? "invalid token" :
            name == "TokenExpiredError" ? "expired token" :
            name == "NotBeforeError"    ? "not before error" :
                                          "error with token"
        
        throw opts.throws()
        
      }
    }
    
    return next()

  }


/*
 * export default function isAuth
 * Checks if the current request context is authenticated and has a claimed user.
*/

export type IsAuthOptions = {
  throws(...args):Error
}

export const isAuth = (opts:IsAuthOptions):koa.Middleware => 
  async (ctx:koa.Context, next) => {

    if(ctx[authenticated]) {

      return next()

    } else {
      throw opts.throws()
    }

  }