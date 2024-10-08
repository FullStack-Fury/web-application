import { Material } from './material.entity.js';

export class ItemHistory extends Material {
    constructor({ id = '', name = '', quantity = 0, quantityStatus = '', provider = '', date = null, textareaContent = '' } = {}) {
        super({ id, name, quantity, quantityStatus, provider });
        this.date = date ? new Date(date).toISOString().split('T')[0] : null;
        this.textareaContent = textareaContent;
    }
}