import { createRouter, createWebHistory } from "vue-router";
import MaterialManagementComponent from "../inventory/pages/material-management.component.vue";
import ItemHistoryManagementComponent from "../inventory/pages/item-history-management.component.vue";
import productManagement from "../inventory/pages/product-management.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/management', name: 'management', component: productManagement, meta: { title: 'Product Management' } },
        { path: '/inventory/materials', name: 'materials', component: MaterialManagementComponent, meta: { title: 'Inventory Management' } },
        { path: '/inventory/item-history', name: 'item-history', component: ItemHistoryManagementComponent, meta: { title: 'Item History' } },
        { path: '/', redirect: '/inventory/materials' }
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'GemZ Dashboard';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;