import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    redirect: '/pages/login',
  },
  {
    path: '/pages/login',
    name: 'Login',
    component: () => import('@/views/pages/Login.vue'),
  },
  {
    path: '/pages/register',
    name: 'Register',
    component: () => import('@/views/pages/Register.vue'),
  },
  {
    path: '/dashboard',
    name: 'DashboardRoot',
    component: DefaultLayout,
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/pages/Profile.vue'),
      },
      {
        path: 'project',
        name: 'list Of Offers',
        component: () => import('@/views/pages/Project.vue'),
      },
      {
        path: 'my-project',
        name: 'My Project',
        component: () => import('@/views/pages/MyProject.vue'),
      },
      {
        path: 'claim',
        name: 'Claim',
        component: () => import('@/views/pages/Claim.vue'),
      },
      {
        path: 'invoices',
        name: 'Invocies',
        component: () => import('@/views/pages/Invoices.vue'),
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('@/views/pages/Inbox.vue'),
      },
      {
        path: 'invoice-management',
        name: 'InvoiceManagement',
        component: () => import('@/views/pages/invoice-management.vue'),
      },
      {
        path: 'project-management',
        name: 'ProjectManagement',
        component: () => import('@/views/pages/project-management.vue'),
      },
      {
        path: 'claim-management',
        name: 'ClaimManagement',
        component: () => import('@/views/pages/claim-management.vue'),
      },
      {
        path: 'customer-freelancer-management',
        name: 'CustomerFreelancerManagement',
        component: () => import('@/views/pages/customer-freelancer-management.vue'),
      },
    ],
  },
]


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
