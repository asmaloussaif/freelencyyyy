<script setup>
import { RouterLink } from 'vue-router'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore()
</script>

<template>
  <CSidebar
    class="custom-sidebar"
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <!-- Sidebar Header -->

    <CSidebarHeader class="sidebar-header">
      <CSidebarBrand>
        <img src="/src/assets/images/lastlogo.png" alt="Freelancyy Logo" class="sidebar-logo" />
      </CSidebarBrand>
      <CCloseButton class="d-lg-none text-dark" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>

    <!-- Sidebar Navigation -->
    <AppSidebarNav />

    <!-- Sidebar Footer -->
    <CSidebarFooter class="border-top d-none d-lg-flex justify-content-center">
      <CSidebarToggler class="text-dark" @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>

<style scoped>
/* Sidebar background and text */
.custom-sidebar {
  background-color: #e5e9f3 !important;
  color: #191627 !important;
}

/* Header centered */
.sidebar-header {
  background-color: #ffffff;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Logo style */
.sidebar-logo {
  width: 100px;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

/* Deep styling for icons and nav links */
:deep(.nav-link),
:deep(.nav-icon),
:deep(.c-sidebar-nav-link),
:deep(svg) {
  color: #000 !important; /* force black */
  fill: #000 !important; /* for SVG icons */
}

/* Hover effect */
:deep(.nav-link:hover) {
  background-color: #e1f0ff !important;
  color: #000 !important;
}
</style>
