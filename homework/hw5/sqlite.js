import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("hw5.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT)");

const router = new Router();

router.get('/', list)
  .get('/people/new', add)
  .get('/people/:id', show)
  .post('/people', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) {
  let list = []
  for (const [id, name, phone] of db.query(sql)) {
    list.push({id, name, phone})
  }
  return list
}

async function list(ctx) {
  let person = query("SELECT id, name, phone FROM posts")
  ctx.response.body = await render.list(person);
}

async function add(ctx) {
  ctx.response.body = await render.newPerson();
}

async function show(ctx) {
  const id = ctx.params.id;
  let person = query(`SELECT id, name, phone FROM posts WHERE id=${id}`)
  let people = person[0]
  if (!people) ctx.throw(404, 'invalid people id');
  ctx.response.body = await render.show(people);
}

async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const people = {}
    for (const [key, value] of pairs) {
      people[key] = value
    }
    db.query("INSERT INTO posts (name, phone) VALUES (?, ?)", [people.name, people.phone]);
    ctx.response.redirect('/');
  }
}

console.log(`Server run at http://127.0.0.1:8002`)
await app.listen({ port:8002 });
