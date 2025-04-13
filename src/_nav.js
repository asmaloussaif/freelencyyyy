import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

export default function getNavItems() {
  const authStore = useAuthStore()

  const baseNavItems = [
    {
      component: 'CNavItem',
      name: 'Dashboard',
      to: '/dashboard/home',
      icon: 'cil-speedometer',
      badge: {
        color: 'primary',
        text: 'NEW',
      },
    },
    {
      component: 'CNavItem',
      name: 'Profile',
      to: '/dashboard/profile',
      icon: 'cil-user',
    },
  ]


  const freelancerNavItems = [
    {
      component: 'CNavItem',
      name: 'List Of Offers',
      to: '/dashboard/project',
      icon: 'cil-briefcase',
    },
    {
      component: 'CNavItem',
      name: 'My Project',
      to: '/dashboard/my-project',
      icon: 'cil-task',
    },
    {
      component: 'CNavItem',
      name: 'Claim',
      to: '/dashboard/claim',
      icon: 'cil-library',
    },
    {
      component: 'CNavItem',
      name: 'Invoices',
      to: '/dashboard/invoices',
      icon: 'cil-money',
    },
    {
      component: 'CNavItem',
      name: 'Inbox',
      to: '/dashboard/inbox',
      icon: 'cil-envelope-open',
    },
  ]

  const clientNavItems = [
    {
      component: 'CNavItem',
      name: 'Invoice Management',
      to: '/pages/invoice-management',
      icon: 'cil-briefcase',
    },
    {
      component: 'CNavItem',
      name: 'Project Management',
      to: '/pages/project-management',
      icon: 'cil-task',
    },
    {
      component: 'CNavItem',
      name: 'Claim',
      to: '/pages/claim',
      icon: 'cil-library',
    },
    {
      component: 'CNavItem',
      name: 'Project List',
      to: '/pages/project-list',
      icon: 'cil-money',
    },
    {
      component: 'CNavItem',
      name: 'Inbox',
      to: '/pages/inbox',
      icon: 'cil-envelope-open',
    },
  ]

  const adminNavItems = [
    {
      component: 'CNavItem',
      name: 'Claim Management',
      to: '/pages/claim-management',
      icon: 'cil-briefcase',
    },
    {
      component: 'CNavItem',
      name: 'Customer/Freelancer Management',
      to: '/pages/customer-freelancer-management',
      icon: 'cil-task',
    },
    {
      component: 'CNavItem',
      name: 'Claim',
      to: '/pages/claim',
      icon: 'cil-library',
    },
  ]

  // Reactive computed property to get the nav items based on the role
  const navItems = computed(() => {
    const userRole = authStore.role

    // Base items are available to all roles
    let items = [...baseNavItems]

    // Add role-specific items
    if (userRole === 'freelancer') {
      items = [...items, ...freelancerNavItems]
    } else if (userRole === 'client') {
      items = [...items, ...clientNavItems]
    } else if (userRole === 'admin') {
      items = [...items, ...adminNavItems]
    }

    return items
  })

  return navItems
}
