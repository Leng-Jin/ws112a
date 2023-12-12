import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
 
const account = new Map();
account.set("john", {
  name: "john",
  tel: "082-313345",
});
account.set("mary", {
  name: "mary",
  tel: "082-313543",
});

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.redirect('http://127.0.0.1:8001/public/index.html')
  })
  .get("/account", (ctx) => {
    ctx.response.body = Array.from(peoples.values());
  })
  .post("/account/register", async (ctx) => {
        const body = ctx.request.body()
        if (body.type === "form") {
          const pairs = await body.value
          console.log('pairs=', pairs)
          const params = {}
          for (const [key, value] of pairs) {
            params[key] = value
          }
          console.log('params=', params)
          let name = params['name']
          let password = params['password']
          console.log(`name=${name} password=${password}`)
          if (account.get(name)) {
            ctx.response.type = 'text/html'
            ctx.response.body = `<p>此帳號已存在! 註冊失敗</p><p><a href="/public/register.html">請重新註冊</a></p>`}
            else {
                account.set(name, {name, password})
                ctx.response.type = 'text/html'
                ctx.response.body = `<p>註冊成功</p><p><a href="/public/login.html">前往登入頁面</a></p>`
            }
        }
  })
  .post("/account/login", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let name = params['name']
      let password = params['password']
      console.log(`name=${name} password=${password}`)
      if (account.get(name)&&password==account.get(name).password) {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>登入成功</p><p><a href="/public/index.html">進入系統</a></p>`
      } else {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>登入失敗，請檢查帳號密碼是否有錯！</p><p><a href="/public/login.html">請重新登入</a></p>`
      }
    }
  })
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0]
    console.log('wpath=', wpath)
    await send(ctx, wpath, {
      root: Deno.cwd()+"/public/",
      index: "index.html",
    })
  })

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8001')

await app.listen({ port: 8001 });
