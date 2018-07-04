import React, { Component } from 'react';
import { Redirect,Route,Switch } from 'react-router-dom';

import Nav from './page/nav';
import Footer from './page/footer';
import Home from './page/home';
import Product from './page/product';
import User from './page/user';

class App extends Component {
  render() {
    return [(
      <Nav key='rootTopNav'/>
    ),(
      <Switch key='rootMain'>
        <Route path='/' exact={true} component={ Home } />
        <Route path='/user/:id' exact={true} component={ User } />
        <Redirect from='/user' to='/user/1' exact={ true } />
        <Route path='/product/:id' exact={true} component={ Product } />
        <Redirect from='/product' to='/product/1' exact={ true } />
        <Redirect to='/' />
      </Switch>
    ),(
      <Footer key='rootFooter'/>
    )];
  }
}

export default App;
