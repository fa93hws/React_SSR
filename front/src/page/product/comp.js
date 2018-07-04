import * as React from 'react';

export default class ProductComp extends React.Component {
  static defaultProps = {
    message: '',
  }
  render() {
    return (
      <main>
        <article>
          <h1>
            This is the Product page
          </h1>
          <h3>
            Product Info:
          </h3>
          <p>
            Data comes from { this.props.userAgent }
          </p>
          <p>
            Data: { this.props.id }
          </p>
        </article>
      </main>
    )
  }
}