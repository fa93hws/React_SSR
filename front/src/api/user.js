import axios from 'axios';

class UserApi {
  getUser(id) {
    return axios.get(`/api/user/${ id }`);
  }
}

const userApi = new UserApi();
export default userApi;