import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to='/'>Home</Link>
        <span>&emsp;</span>
        <Link to='/user/213'>User</Link>
        <span>&emsp;</span>
        <Link to='/product/123'>Product</Link>
      </nav>
    )
  }
}