import axios from 'axios';
import { renderToString } from 'react-dom/server';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import fs from 'fs';
const express = require('express');
const app = express();

import App from '../front/src/App';



const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'User-Agent': 'node-server'
  }
});
const htmlPath = `./wwwroot/spa/index.html`;
const path = require('path');
const port = 5000;

const SSRUtils = {
  injectGlobalVariable(html, object, varName) {
    const placeholder = `<script id="ssr-placeholder"></script>`;
    object = { data: object, ssr: true };
    return html.replace(placeholder, `<script id='ssr-placeholder'>window.${ varName } = ${ JSON.stringify(object) }</script>`);
  },
  injectBody(html,body) {
    const placeholder = `<div id="root"></div>`;
    return html.replace(placeholder, `<div id="root">${ body }</div>`);
  },
  getRenderedString(url) {
    const context = {};
    const body = renderToString(
      <StaticRouter location={ url } context={ context }>
        <App />
      </StaticRouter>
    );
    return body;
  },
  replyRenderedStringWithPreAjax: function(req, res, axiosConfig, varName) {
    fs.readFile(htmlPath, 'utf-8', (err,html) => {
      const body = SSRUtils.getRenderedString(req.url);
      html = SSRUtils.injectBody(html,body);
      axiosInstance.request(axiosConfig).then( ajaxRes => {
        html = SSRUtils.injectGlobalVariable(html, ajaxRes.data, varName);
      }).finally(() => {
        res.send(html);
      }) // axios
    }) // fs
  } //replyRenderedStringWithPreAjax
}

// server side rendering
app.get('/', (req,res) => {
  fs.readFile(htmlPath,'utf8',(err,html) => {
    const body = SSRUtils.getRenderedString(req.url);
    res.send(SSRUtils.injectBody(html,body));
  })
})

app.get('/user/:id', function(req, res) {
  SSRUtils.replyRenderedStringWithPreAjax(req,res,{
    url: `/api/user/${ req.params.id }`,
    method: 'get',    
  },'__ssr_user_page__')
})

app.get('/product/:id', function(req,res) {
  SSRUtils.replyRenderedStringWithPreAjax(req,res,{
    url: `/api/product/${ req.params.id }`,
    method: 'get',    
  },'__ssr_product_page__')
}) 


app.get('/api/user/:id', function(req, res) {
  const responseBody = {
    userAgent: req.get('User-Agent'),
    id: req.params.id,
  };
  res.send(responseBody);
});

// restful api
app.get('/api/product/:id', function(req,res) {
  const responseBody = {
    userAgent: req.get('User-Agent'),
    id: req.params.id
  };
  res.send(responseBody);
});

app.use(express.static('wwwroot'));
// default router
app.use(function(req, res){
  res.sendFile(path.join(__dirname + '/wwwroot/spa/index.html'));
});
app.listen(port, () => console.log(`Example app listening on port ${ port }!`));