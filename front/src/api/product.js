import axios from 'axios';

class ProductApi {
  getProduct(id) {
    return axios.get(`/api/product/${ id }`);
  }
}

const productApi = new ProductApi();
export default productApi;