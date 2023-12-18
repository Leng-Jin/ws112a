import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/nqu", (context) => {
    context.response.body = `
    <html>
        <body>
            <a href = "https://www.nqu.edu.tw/">金門大學</a>
        </body>
    </html>`
  })
  .get("/nqu/csie", (context) => {
      context.response.body = `
      <html>
          <body>
              <a href = "https://csie.nqu.edu.tw/">金門大學資訊工程學系</a>
          </body>
      </html>`
  })
  .get("/to/nqu", (context) => {
    context.response.redirect('https://www.nqu.edu.tw/')
  })
  .get("/to/nqu/csie", (context) => {
    context.response.redirect('https://csie.nqu.edu.tw/')
  })
  .get("/room/E319", (context) => {
    context.response.body = "數位系統應用實驗室";
  })
  .get("/room/E320", (context) => {
    context.response.body = "多媒體教室";
  })
  .get("/room/E321", (context) => {
    context.response.body = "電腦網路實驗室";
  })
  .get("/room/E322", (context) => {
    context.response.body = "嵌入式實驗室";
  });


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
