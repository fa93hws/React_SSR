import * as React from 'react';

import { EAjaxStatus } from '../../enums';
import productApi from '../../api/product';
import ProductComp from './comp';


export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productID: this.props.match.params.id,
      message: '',
      pageAjaxStatus: EAjaxStatus.notSubmitted
    }
  }
  componentDidMount() {
    productApi.getProduct(this.state.productID).then(res => {
      this.setState({ 
        message: `Send from ${ res.data.userAgent }, request product id is ${ res.data.id }`
      })
    }).catch(err => {
      console.log(err);
      this.setState({
        message: 'error'
      })
    }).finally(() => {
      this.setState({ pageAjaxStatus: EAjaxStatus.done });
    });
  }
  render() {
    return (
      <ProductComp
        message={ this.state.message }
      />
    )
  }
}