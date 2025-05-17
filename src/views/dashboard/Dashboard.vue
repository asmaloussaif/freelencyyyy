<template>
  <div class="dashboard-container">
    <!-- FREELANCER VIEW -->
    <template v-if="userRole === 'freelancer'">
      <div class="welcome-message">
        <h3>Welcome back, {{ userName }}! 👋</h3>
        <p>Here’s what’s happening in your dashboard today.</p>
      </div>

       <div class="summary-container">
    <div class="summary-card" v-for="(value, key) in summary" :key="key">
      <h6>{{ labels[key] || key }}</h6>
      <p>{{ value }}</p>
    </div>
  </div>

      <div class="charts-container">
        <div class="chart-card">
          <h5 class="chart-title">📊 Projects by Status</h5>
          <Pie :data="pieChartData" :options="chartOptions" />
        </div>
        <div class="chart-card">
          <h5 class="chart-title">📅 Projects by Deadline</h5>
          <Pie :data="secondPieChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="activity-card">
        <h5>⚡ Recent Activity</h5>
        <ul>
          <li>✉️ A new message was received</li>
          <li>✅ A project status was updated</li>
          <li>📅 A deadline is approaching</li>
        </ul>
      </div>
    </template>

    <!-- ADMIN VIEW -->
    <template v-else-if="userRole === 'admin'">
      <div class="welcome-message">
        <h3>Welcome back, Admin 👋</h3>
        <p>Here’s an overview of the platform's activity today.</p>
      </div>

       <div class="summary-container">
    <div class="summary-card" v-for="(value, key) in summary" :key="key">
      <h6>{{ labels[key] || key }}</h6>
      <p>{{ value }}</p>
    </div>
  </div>

      <div class="charts-container">
        <div class="chart-card">
          <h5 class="chart-title">👤 User Distribution</h5>
          <!-- <Pie :data="userChartData" :options="chartOptions" /> -->
        </div>
        <div class="chart-card">
          <h5 class="chart-title">📊 Projects by Status</h5>
          <!-- <Pie :data="projectChartData" :options="chartOptions" /> -->
        </div>
      </div>

      <div class="activity-card">
        <h5>📩 Latest Claims</h5>
        <ul>
          <li v-for="claim in recentClaims" :key="claim.id">
            {{ claim.user.name }} submitted a claim: "{{ claim.subject }}"
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button class="admin-btn" @click="goToUserManagement">Manage Users</button>
        <button class="admin-btn" @click="goToProjectManagement">Manage Projects</button>
        <button class="admin-btn" @click="goToClaims">View All Claims</button>
      </div>
    </template>

    <!-- CLIENT VIEW -->
    <template v-else>
      <div class="welcome-message">
        <h3>Welcome back, {{ userName }}! 👋</h3>
        <p>Here’s what’s happening in your dashboard today.</p>
      </div>

      

      <div class="summary-container">
    <div class="summary-card" v-for="(value, key) in summary" :key="key">
      <h6>{{ labels[key] || key }}</h6>
      <p>{{ value }}</p>
    </div>
  </div>

      <div class="charts-container">
        <div class="chart-card">
          <h5 class="chart-title">📊 Projects by Status</h5>
          <Pie :data="pieChartData" :options="chartOptions" />
        </div>
        <div class="chart-card">
          <h5 class="chart-title">📅 Projects by Deadline</h5>
          <Pie :data="secondPieChartData" :options="chartOptions" />
        </div>
      </div>
<div class="filter-bar">
        <div class="filter-item">
          <select v-model="selectedSkill" @change="filterFreelancers" class="filter-select">
            <option value="">Select Skill</option>
            <option v-for="skill in skills" :key="skill" :value="skill">{{ skill }}</option>
          </select>
        </div>
        <div class="filter-item">
          <select v-model="selectedRating" @change="filterFreelancers" class="filter-select">
            <option value="">Select Rating</option>
            <option v-for="rating in ratings" :key="rating" :value="rating">{{ rating }} & Up</option>
          </select>
        </div>
        <div class="filter-item">
          <select v-model="selectedHourlyRate" @change="filterFreelancers" class="filter-select">
            <option value="">Select Hourly Rate</option>
            <option value="20">Less than 20DT/hr</option>
            <option value="50">Less than 50DT/hr</option>
            <option value="100">Less than 100DT/hr</option>
          </select>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-semibold text-[#0F2573] mb-4">Suggested Freelancers</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="freelancer in filteredFreelancers" :key="freelancer.id" class="freelancer-card">
            <div class="flex items-center gap-4">
              <div>
                <h3 class="font-bold">{{ freelancer.user.name }} {{ freelancer.user.lastName }}</h3>
                <p class="text-sm text-gray-500">{{ freelancer.competences.join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const router = useRouter()
const authStore = useAuthStore()
const userRole = authStore.role
const userName = ref(authStore.user.name)

const summary = ref({ total: 0, completed: 0, in_progress: 0, open: 0 })

const labels = {
  total: 'Total Projects',
  completed: 'Completed Projects',
  in_progress: 'In Progress',
  open: 'Open for Commits',
}

const pieChartData = ref({ labels: [], datasets: [] })
const secondPieChartData = ref({ labels: [], datasets: [] })
const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } }

const selectedSkill = ref('')
const selectedRating = ref('')
const selectedHourlyRate = ref('')
const skills = ref(['Web Development', 'Graphic Design', 'SEO'])
const ratings = ref([1, 2, 3, 4, 5])

const freelancers = ref([])
const filteredFreelancers = ref([])

const fetchUser = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }

  try {
    const idsRes = await axios.get('http://127.0.0.1:8000/api/freelencerId', { headers })
    const userIds = idsRes.data
    const profileRes = await axios.get('http://127.0.0.1:8000/api/freelancers_list', {
      headers,
      params: { user_ids: userIds },
    })
    freelancers.value = profileRes.data
  } catch (error) {
    console.error('Error fetching freelancers:', error)
  }
}

const filterFreelancers = () => {
  filteredFreelancers.value = freelancers.value.filter(f => {
    const skillMatch = !selectedSkill.value || f.competences.includes(selectedSkill.value)
    const ratingMatch = !selectedRating.value || f.note >= parseInt(selectedRating.value)
    const rateMatch = !selectedHourlyRate.value || f.tarif <= parseInt(selectedHourlyRate.value)
    return skillMatch && ratingMatch && rateMatch
  })
}

onMounted(async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }
  await fetchUser()

  const [statusRes, deadlineRes, summaryRes] = await Promise.all([
    axios.get('http://127.0.0.1:8000/api/charts/status', { headers }),
    axios.get('http://127.0.0.1:8000/api/charts/deadlines', { headers }),
    axios.get('http://127.0.0.1:8000/api/projects/summary', { headers }),
  ])

  statusData.value = statusRes.data
  pieChartData.value = {
    labels: statusData.value.map(i => i.statut),
    datasets: [{ label: 'Projects by Status', data: statusData.value.map(i => i.count), backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'] }],
  }

  deadlineData.value = deadlineRes.data
  secondPieChartData.value = {
    labels: deadlineData.value.map(i => i.month),
    datasets: [{ label: 'Projects by Deadline', data: deadlineData.value.map(i => i.count), backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'] }],
  }

  let total = 0
  summaryRes.data.forEach(item => {
    total += item.total
    if (item.statut === 'completed') summary.value.completed = item.total
    else if (item.statut === 'in_progress') summary.value.in_progress = item.total
    else if (item.statut === 'open') summary.value.open = item.total
  })
  summary.value.total = total

  filterFreelancers()
})

const goToUserManagement = () => router.push('/admin/customer-freelancer-management')
const goToProjectManagement = () => router.push('/admin/inbox')
const goToClaims = () => router.push('/admin/claim-management')
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-message {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-item select {
  padding: 8px;
  border-radius: 5px;
}

.summary-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
}

.charts-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background-color: #f6f9fd;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.freelancer-card {
  background-color: #ecedf0;
  padding: 20px;
  border-radius: 8px;
}

.freelancer-card button {
  width: 100%;
}

.activity-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
button {
  font-size: 0.875rem; /* Smaller font size for the button text */
  padding: 0.25rem 0.75rem; /* Adjusted padding for a smaller button */
  display: inline-flex; /* Prevent the button from stretching full width */
  align-items: center;
  gap: 0.5rem; /* Gap between the icon and text */
  background-color: #1a9bf1;
  border: none;
  border-radius: 9999px; /* Make it fully rounded */
  cursor: pointer;
}

button:hover {
  background-color: #137dbb; /* Darker shade for hover effect */
}

button i {
  font-size: 1rem; /* Icon size */
}
</style>
