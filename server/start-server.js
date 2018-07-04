const port = 5000;
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/post/:id', (req, res) => {
  const responseBody = {
    userAgent: req.get('User-Agent'),
    id: req.params.id
  }
  res.send(responseBody);
})

app.listen(port, () => console.log(`Example app listening on port ${ port }!`))