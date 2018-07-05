import axios from 'axios';

import { enableSSR } from '../decorator';
import { ESSRVarName } from '../enums'

class UserApi {
  @enableSSR(ESSRVarName.user)
  getUser(id) {
    return axios.get(`/api/user/${ id }`);
  }
}

const userApi = new UserApi();
export default userApi;