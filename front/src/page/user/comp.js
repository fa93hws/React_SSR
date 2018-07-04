import * as React from 'react';

export default class UserComp extends React.Component {
  static defaultProps = {
    message: ''
  }
  render() {
    return (
      <main>
        <article>
          <h1>
            This is the user page
          </h1>
          <h3>
            User Info:
          </h3>
          <p>
            { this.props.message }
          </p>
        </article>
      </main>
    )
  }
}