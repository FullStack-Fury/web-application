import {createRouter, createWebHistory} from "vue-router";
import MaterialManagementComponent from "../inventory/pages/material-management.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/inventory/materials',   name: 'materials', component: MaterialManagementComponent, meta: { title: 'Inventory Management'}},
        { path: '/',                        redirect: '/inventory/materials'}
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'GemZ Dashboard';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})
export default router;