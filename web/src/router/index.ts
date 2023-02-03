import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EditItem from '../views/EditItem.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { transition: 'slide-left', mode: 'in-out' },
    },
    {
        path: '/editItem',
        name: 'EditItem',
        component: EditItem,
        meta: { transition: 'slide-right', mode: 'out-in' },
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

export default router;
