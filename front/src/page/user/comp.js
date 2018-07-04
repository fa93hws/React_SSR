import * as React from 'react';

export default class UserComp extends React.Component {
  static defaultProps = {
    userAgent: '',
    id: -1,
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