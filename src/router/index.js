import {createRouter, createWebHistory} from "vue-router";
import MaterialManagementComponent from "../inventory/pages/material-management.component.vue";
import productManagement from "../management/pages/product-management.component.vue";
import DashboardManagement from "../public/components/dashboard-management.vue";
import ItemHistoryManagementComponent from "../inventory/pages/item-history-management.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/management', name: 'management', component: productManagement, meta: { title: 'Product Management'}},
        { path: '/inventory/materials',   name: 'materials', component: MaterialManagementComponent, meta: { title: 'Inventory Management'}},
        { path: '/inventory/item-history', name: 'item-history', component: ItemHistoryManagementComponent, meta: { title: 'Item History' } },
        { path: '/dashboard',   name: 'dashboard', component: DashboardManagement, meta: { title: 'Dashboard Management' }},
        { path: '/',                        redirect: '/inventory/materials'},
        {
            path: '/product-management', // Nueva ruta para el manejo de productos
            name: 'product-management',
            component: productManagement,
            props: route => ({ status: route.query.status }), // Pasar el estado como prop
            meta: { title: 'Product Management' }
        },
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'GemZ Dashboard';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})
export default router;