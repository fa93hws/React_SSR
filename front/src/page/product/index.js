import * as React from 'react';

import { injectSSRState } from '../../decorator';
import { EAjaxStatus,ESSRVarName } from '../../enums';
import productApi from '../../api/product';
import ProductComp from './comp';

@injectSSRState(ESSRVarName.product)
export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productID: this.props.match.params.id,
      userAgent: '',
      id: -1,
      pageAjaxStatus: EAjaxStatus.notSubmitted
    }
  }
  componentDidMount() {
    productApi.getProduct(this.state.productID).then(res => {
      this.setState({ 
        // message: `Send from ${ res.data.userAgent }, request product id is ${ res.data.id }`
        userAgent: res.data.userAgent,
        id: res.data.id
      })
    }).finally(() => {
      this.setState({ pageAjaxStatus: EAjaxStatus.done });
    });
  }
  render() {
    if (this.state.pageAjaxStatus === EAjaxStatus.done) {
      return (
        <ProductComp
          { ...this.state }
        />
      )
    } else {
      return (<main>Loading...</main>)
    }

  }
}