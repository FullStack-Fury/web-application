export class Material    {
    constructor({ id = '', name = '', quantity= 0, quantityStatus='', provider='' }) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.quantityStatus = quantityStatus;
        this.provider= provider;
    }
}