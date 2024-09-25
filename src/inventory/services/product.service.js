import http from "../../shared/services/http-common.js";

export class ProductService {
    resourceEndpoint = '/products';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(productResource) {
        return http.post(this.resourceEndpoint, productResource);
    }

    update(id, productResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, productResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}
