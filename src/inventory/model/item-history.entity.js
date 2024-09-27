import { Material } from './material.entity.js';

export class ItemHistory extends Material {
    constructor({ id = '', name = '', quantity = 0, quantityStatus = '', provider = '', date = null, textareaContent = '' } = {}) {
        super({ id, name, quantity, quantityStatus, provider });
        this.date = date;
        this.textareaContent = textareaContent;
    }
}