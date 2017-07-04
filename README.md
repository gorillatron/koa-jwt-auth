```
import * as koa from 'koa'
import * as Router from 'koa-router
import {auth, isAuth} from 'koa-jwt-auth'


const server = new koa()
const router = new Router()


router.use(auth({
  secret: "bees-knees",
  throws: () => 
    new AuthorizationError("Your request authorization headers where not accepted.")
}))

const ensureAuth = isAuth({
  throws: () => 
    new AuthorizationError("You are not authenticated to make that request.")
})

router.get("/protected", ensureAuth, protectedResource)


server.use(router.routes())
server.use(router.allowedMethods())
```