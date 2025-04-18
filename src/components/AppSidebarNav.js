import { useAuthStore } from '@/stores/authStore'
import { defineComponent, computed, h, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const authStore = useAuthStore()
    const route = useRoute()
    
      console.log('Current role:', authStore.role)
   
    const role = computed(() => authStore.role)
    console.log(role)
    // Base items for all roles
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
        name: 'Invoices',
        to: '/dashboard/invoices',
        icon: 'cil-money',
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

    // Computed navItems that updates based on user role
    const navItems = computed(() => {
      let items = [...baseNavItems]
    
      if (role.value === 'freelancer') {
        items = [...items, ...freelancerNavItems]
      } else if (role.value === 'client') {
        items = [...items, ...clientNavItems]
      } else if (role.value === 'admin') {
        items = [...items, ...adminNavItems]
      }
    
      return items
    })

    // Render navigation items
    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      if (item.href) {
        return h(
          resolveComponent(item.component),
          {
            href: item.href,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          {
            default: () => [
              item.icon
                ? h(resolveComponent('CIcon'), {
                    customClassName: 'nav-icon',
                    name: item.icon,
                  })
                : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
              item.name,
              item.external && h(resolveComponent('CIcon'), {
                class: 'ms-2',
                name: 'cil-external-link',
                size: 'sm'
              }),
              item.badge &&
                h(
                  CBadge,
                  {
                    class: 'ms-auto',
                    color: item.badge.color,
                    size: 'sm',
                  },
                  {
                    default: () => item.badge.text,
                  },
                ),
            ],
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                            size: 'sm',
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => navItems.value.map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav }
