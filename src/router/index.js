import { createRouter, createWebHistory } from 'vue-router';
import MainTodo from '../views/MainTodo.vue';
import EditTodo from '../views/EditTodo.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainTodo
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditTodo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
