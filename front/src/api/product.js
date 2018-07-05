import axios from 'axios';

import { enableSSR } from '../decorator';
import { ESSRVarName } from '../enums'

class ProductApi {
  @enableSSR(ESSRVarName.product)
  getProduct(id) {
    return axios.get(`/api/product/${ id }`);
  }
}

const productApi = new ProductApi();
export default productApi;