import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'

const person = [
  {id:0, name:'Cham', phone:'091234567'},
  {id:1, name:'BB', phone:'082345678'}
];

const router = new Router();

router.get('/', list)
  .get('/people/new', add)
  .get('/people/:id', show)
  .post('/people', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.body = await render.list(person);
}

async function add(ctx) {
  ctx.response.body = await render.newPerson();
}

async function show(ctx) {
  const id = ctx.params.id;
  const people = person[id];
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
    const id = person.push(people) - 1;
    people.id = id;
    ctx.response.redirect('/');
  }
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });