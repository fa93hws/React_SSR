import * as React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

export default class Nav extends React.Component {
  render() {
    return (
      <nav className='top-nav__wrapper'>
        <Link to='/'>Home</Link>
        <span>&emsp;</span>
        <Link to='/user/213'>User</Link>
        <span>&emsp;</span>
        <Link to='/product/123'>Product</Link>
      </nav>
    )
  }
}