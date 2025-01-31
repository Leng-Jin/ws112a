import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const app = new Application();

app.use(oakCors({
  origin: "*", // 允許所有來源
  methods: ["GET", "POST"], // 允許的 HTTP 方法
  headers: ["Content-Type"], // 允許的 headers
}));


const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, title TEXT, body TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");



const account = new Map();
const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.redirect('http://127.0.0.1:8001/public/login.html');
  })
  .get("/account", (ctx) => {
    ctx.response.body = Array.from(account.values()); 
  })
  .post("/account/login", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      console.log('pairs=', pairs);
      const params = {};
      for (const [key, value] of pairs) {
        params[key] = value;
      }
      console.log('params=', params);
      let email = params['email'];
      let password = params['password'];
      console.log(`name=${email} password=${password}`);
      if (account.get(email) && password === account.get(email).password) {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>登入成功</p><p><a href="/public/index.html">首頁</a></p>`
      } else {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>登入失敗，請檢查帳號密碼是否有錯！</p><p><a href="/public/login.html">請重新登入</a></p>`;
      }
    }
  })
  .post("/account/register", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      console.log('pairs=', pairs);
      const params = {};
      for (const [key, value] of pairs) {
        params[key] = value;
      }
      console.log('params=', params);
      let email = params['email'];
      let password = params['password'];
      console.log(`name=${email} password=${password}`);
      if (account.get(email)) {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>此帳號已存在! 註冊失敗</p><p><a href="/public/register.html">請重新註冊</a></p>`;
      } else {
        account.set(email, { email, password });
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>註冊成功</p><p><a href="/public/login.html">回登入頁面</a></p>`
        
      }
    }
  })
  .get("/search", async (ctx) => {
    const searchTerm = ctx.request.url.searchParams.get("term");
    try {
      const searchResults = await performMusicSearch(searchTerm);
      ctx.response.body = searchResults;
    } catch (error) {
      console.error('Error performing music search:', error);
      ctx.response.body = 'Error performing music search';
      ctx.response.status = 500;
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
  


app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8001');
await app.listen({ port: 8001 });
