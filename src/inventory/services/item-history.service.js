import http from "../../shared/services/http-common.js";

export class ItemHistoryService {
    resourceEndpoint = '/item-history';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(itemHistoryResource) {
        return http.post(this.resourceEndpoint, itemHistoryResource);
    }

    update(id, itemHistoryResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, itemHistoryResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}