import http from "../../shared/services/http-common.js";

export class MaterialService {
    resourceEndpoint = 'materials';

    getAll() {
        console.log(http.defaults.baseURL);
        console.log(this.resourceEndpoint);
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(materialResource) {
        return http.post(this.resourceEndpoint, materialResource);
    }

    update(id, materialResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, materialResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByName(name) {
        return http.get(`${this.resourceEndpoint}?name=${name}`);
    }

}