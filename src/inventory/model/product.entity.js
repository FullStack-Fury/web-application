export class Product {
    constructor({ id = null, name = '', materials = [] } = {}) {
        this.id = id;
        this.name = name;
        this.materials = materials;
    }
}