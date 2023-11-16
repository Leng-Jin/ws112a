export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
  
      h1 {
        font-size: 2em;
      }
  
      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
  
      #posts li:last-child {
        border-bottom: none;
      }
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
        width: 500px;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `
}

export function list(person) {
  let list = []
  for (let people of person) {
    list.push(`
    <li>
      <h2>${ people.name}</h2>
      <p><a href="/people/${people.id}">聯絡人資料</a></p>
    </li>
    `)
  }
  let content = `
  <h1>通訊錄</h1>
  <p>你有 <strong>${person.length}</strong> 個聯絡人!</p>
  <p><a href="/people/new">新增聯絡人</a></p>
  <ul id="person">
    ${list.join('\n')}
  </ul>
  `
  return layout('通訊錄', content)
}

export function newPerson() {
  return layout('新增聯絡人', `
  <h1>新聯絡人</h1>
  <p>填寫聯絡人資料</p>
  <form action="/people" method="post">
    <p><input type="text" placeholder="姓名" name="name"></p>
    <p><textarea placeholder="電話號碼" name="phone"></textarea></p>
    <p><input type="submit" value="新增"></p>
  </form>
  `)
}

export function show(people) {
  return layout(people.name, `
    <h1>${people.name}</h1>
    <pre>${people.phone}</pre>
  `)
}