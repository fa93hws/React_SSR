import * as React from 'react';

import { EAjaxStatus } from '../../enums';
import userApi from '../../api/user';
import UserComp from './comp';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.match.params.id,
      message: '',
      pageAjaxStatus: EAjaxStatus.notSubmitted
    }
  }
  componentDidMount() {
    userApi.getUser(this.state.userID).then(res => {
      this.setState({ 
        message: `Send from ${ res.data.userAgent }, request user id is ${ res.data.id }`
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
    if (this.state.pageAjaxStatus === EAjaxStatus.done) {
      return (
        <UserComp
          message={ this.state.message }
        />
      )
    } else {
      return (<main>loading...</main>)
    }
  }
}