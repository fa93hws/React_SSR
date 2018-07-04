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
            This is the product page
          </h1>
          <h3>
            Product Info:
          </h3>
          <p>
            { this.props.message }
          </p>
        </article>
      </main>
    )
  }
}