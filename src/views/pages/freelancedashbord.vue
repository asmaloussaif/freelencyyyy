
 <script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const pieChartData = ref({ labels: [], datasets: [] })
const secondPieChartData = ref({ labels: [], datasets: [] })

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
  },
}

const summary = ref({ total: 0, completed: 0, in_progress: 0, open: 0 })
const userName = ref('')

onMounted(async () => {
  const authStore = useAuthStore()
  const headers = { Authorization: `Bearer ${authStore.token}` }
  userName.value = authStore.user.name

  const statusRes = await axios.get('http://127.0.0.1:8000/api/charts/status', { headers })
  const statusData = statusRes.data
  pieChartData.value = {
    labels: statusData.map(item => item.statut),
    datasets: [{
      label: 'Projects by Status',
      data: statusData.map(item => item.count),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    }],
  }

  const deadlineRes = await axios.get('http://127.0.0.1:8000/api/charts/deadlines', { headers })
  const deadlineData = deadlineRes.data
  secondPieChartData.value = {
    labels: deadlineData.map(item => item.month),
    datasets: [{
      label: 'Projects by Deadline',
      data: deadlineData.map(item => item.count),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    }],
  }

  const summaryRes = await axios.get('http://127.0.0.1:8000/api/projects/summary', { headers })
  let total = 0
  summaryRes.data.forEach(item => {
    total += item.total
    if (item.statut === 'completed') summary.value.completed = item.total
    else if (item.statut === 'in_progress') summary.value.in_progress = item.total
    else if (item.statut === 'open') summary.value.open = item.total
  })
  summary.value.total = total
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Welcome -->
    <div class="welcome-message">
      <h3>Welcome back, {{ userName }}! 👋</h3>
      <p>Here’s what’s happening in your freelance dashboard today.</p>
    </div>

    <!-- Summary -->
    <div class="summary-container">
      <div class="summary-card" v-for="(value, key) in summary" :key="key">
        <h6>{{ key.replace('_', ' ').toUpperCase() }}</h6>
        <p>{{ value }}</p>
      </div>
    </div>

    <!-- Charts -->
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

    <!-- Activity -->
    <div class="activity-card">
      <h5>⚡ Recent Activity</h5>
      <ul>
        <li>💼 You were assigned to a new project</li>
        <li>✅ Project “Landing Page Redesign” marked as completed</li>
        <li>📅 Deadline approaching for “Mobile App UI”</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-message {
  margin-bottom: 20px;
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

.activity-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
