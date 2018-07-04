import * as React from 'react';

import { injectSSRState } from '../../decorator';
import { EAjaxStatus } from '../../enums';
import userApi from '../../api/user';
import UserComp from './comp';

@injectSSRState
export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.match.params.id,
      userAgent: '',
      id: -1,
      pageAjaxStatus: EAjaxStatus.notSubmitted
    }
  }
  componentDidMount() {
    userApi.getUser(this.state.userID).then(res => {
      this.setState({ 
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
        <UserComp
          { ...this.state }
        />
      )
    } else {
      return (<main>loading...</main>)
    }
  }
}