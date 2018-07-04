import axios from 'axios';

class ProductApi {
  getProduct(id) {
    if ('__ssr_product_page__' in window && window.__ssr_product_page__.ssr === true) {
      return new Promise((resolve,reject) => {
        resolve(window.__ssr_product_page__);
        delete window.__ssr_product_page__;
      });
    } else {
      return axios.get(`/api/product/${ id }`);
    }
  }
}

const productApi = new ProductApi();
export default productApi;