
import * as Koa                       from 'koa'
import * as jwt                       from 'jsonwebtoken'
import {auth, isAuth, authenticated}  from '../src'


describe("authentication", () => {

  class AuthorizationError extends Error {}

  const secret = "test secret"
  const throws = (ctx:Koa.Context) => new AuthorizationError()
  const authMiddleware = auth({secret, throws})


  describe("auth middleware", () => {
    
    
     test("auth should call next middleware if valid token", async (done) => {

      const token = jwt.sign({}, secret)

      expect(typeof token).toBe("string")

      const ctx = <Koa.Context> {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      const next = jest.fn()

      await authMiddleware(ctx, next)

      expect(next).toHaveBeenCalled()
      expect(ctx[authenticated]).toBe(true)

      try {
        await authMiddleware(<Koa.Context> {
          headers: {
            "Authorization": `Bearer invalid token`
          }
        }, next)
      }
      catch(error) {
        expect(error instanceof AuthorizationError).toBe(true)
      }

      done()
    })




    test("auth should throw AuthorizationError if invalid token", async (done) => {

      const token = jwt.sign({}, secret)

      expect(typeof token).toBe("string")

      const next = jest.fn()

      try {

        await authMiddleware(<Koa.Context> {
          headers: {
            "Authorization": `Bearer invalid token`
          }
        }, next)

      }
      catch(error) {
        expect(error instanceof AuthorizationError).toBe(true)
      }

      expect(next).not.toHaveBeenCalled()

      done()
    })

  })

 

  describe("isAuth middleware", () => {

    test("it should call next middleware if context is authenticated", async (done) => {
      
      let ctx = <any> {
        [authenticated]: true
      }

      const next = jest.fn()

      await isAuth({throws})(ctx, next)

      expect(next).toHaveBeenCalled()

      done()
    })

    test("it should throw AuthorizationError if context is not authenticated", async (done) => {
      
      let ctx = <any> {}

      const next = jest.fn()

      try {
        await isAuth({throws})(ctx, next)
      }
      catch(error) {
        expect(error instanceof AuthorizationError).toBe(true)
      }

      expect(next).not.toHaveBeenCalled()

      done()
    })

  })


})