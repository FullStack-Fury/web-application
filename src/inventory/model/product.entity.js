export class Product {
    constructor({ id = '', name = '', materials = [], employeeId = null } = {}) {
        this.id = id;
        this.name = name;
        this.materials = materials; // Array de objetos { materialId, quantity }
        this.employeeId = employeeId;
    }
}
