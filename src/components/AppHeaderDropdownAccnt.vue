<script setup>
import { useAuthStore } from '@/stores/authStore' 
import { useRouter } from 'vue-router'
import avatar from '@/assets/images/avatars/8.jpg'

	const itemsCount = 42

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json',
      },
    })
  } catch (e) {
    console.warn('Logout API call failed', e)
  }

  authStore.logout()
  router.push('/pages/login')
}
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem @click="handleLogout">
        <CIcon icon="cil-lock-locked" />
        Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
