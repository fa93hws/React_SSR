import axios from 'axios';

import { enableSSR } from '../decorator';

class UserApi {
  @enableSSR('__ssr_user_page__')
  getUser(id) {
    return axios.get(`/api/user/${ id }`);
  }
}

const userApi = new UserApi();
export default userApi;