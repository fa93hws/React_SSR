// import { renderToString } from 'react-dom/server';
// import React from 'react';
// import fs from 'fs';

const port = 5000;
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/user/:id', (req, res) => {
  const responseBody = {
    userAgent: req.get('User-Agent'),
    id: req.params.id
  };
  res.send(responseBody);
});
app.get('/api/product/:id', (req,res) => {
  const responseBody = {
    userAgent: req.get('User-Agent'),
    id: req.params.id
  };
  res.send(responseBody);
});

app.use(express.static('wwwroot'));
app.listen(port, () => console.log(`Example app listening on port ${ port }!`));