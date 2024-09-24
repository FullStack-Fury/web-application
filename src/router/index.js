import {createRouter, createWebHistory} from "vue-router";
import MaterialManagementComponent from "../dashboard/pages/material-management.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/dashboard/materials',   name: 'materials', component: MaterialManagementComponent, meta: { title: 'Inventory Management'}},
        { path: '/',                        redirect: '/dashboard/materials'}
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'GemZ Dashboard';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})
export default router;