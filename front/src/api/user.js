import axios from 'axios';

class UserApi {
  getUser(id) {
    if ('__ssr_user_page__' in window && window.__ssr_user_page__.ssr === true) {
      return new Promise((resolve,reject) => {
        resolve(window.__ssr_user_page__);
        delete window.__ssr_user_page__;
      });
    } else {
      return axios.get(`/api/user/${ id }`);
    }
  }
}

const userApi = new UserApi();
export default userApi;