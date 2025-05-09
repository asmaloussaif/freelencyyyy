<!-- <template>
  <div class="client-dashboard">
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
          <option value="20">Less than $20/hr</option>
          <option value="50">Less than $50/hr</option>
          <option value="100">Less than $100/hr</option>
        </select>
      </div>
      <button @click="openAddProjectModal" class="add-project-btn">
        <i class="fas fa-plus"></i> Add New Project
      </button>
    </div>

    <div class="freelancer-listing">
      <div v-for="freelancer in filteredFreelancers" :key="freelancer.id" class="freelancer-card">
        <h3>{{ freelancer.name }}</h3>
        <p class="skills">{{ freelancer.skills.join(', ') }}</p>
        <div class="rating">
          <span v-for="n in 5" :key="n" class="star" :class="{'filled': freelancer.rating >= n}">&#9733;</span>
          <span>({{ freelancer.rating }})</span>
        </div>
        <p>Hourly Rate: ${{ freelancer.hourlyRate }}/hr</p>
        <button @click="viewProfile(freelancer)" class="view-profile-btn">View Profile</button>
      </div>
    </div>

    <CModal :backdrop="false" :keyboard="false" v-model:visible="showModal">
      <CModalHeader>
        <CModalTitle>Create New Project</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <label for="project-name">Project Name:</label>
        <input type="text" v-model="newProject.name" id="project-name" class="form-control" />

        <label for="project-description">Description:</label>
        <textarea v-model="newProject.description" id="project-description" class="form-control"></textarea>

        <label for="project-skill">Required Skill:</label>
        <select v-model="newProject.skill" id="project-skill" class="form-control">
          <option v-for="skill in skills" :key="skill" :value="skill">{{ skill }}</option>
        </select>

        <label for="project-budget">Budget:</label>
        <input type="number" v-model="newProject.budget" id="project-budget" class="form-control" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Cancel</CButton>
        <CButton color="primary" @click="submitProject">Submit</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/vue';

export default {
  components: {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
  },
  data() {
    return {
      skills: ['Web Development', 'Graphic Design', 'App Development', 'Content Writing', 'SEO', 'Digital Marketing'],
      ratings: [3, 4, 5],
      selectedSkill: '',
      selectedRating: '',
      selectedHourlyRate: '',
      freelancers: [
        { id: 1, name: 'John Doe', skills: ['Web Development', 'SEO'], rating: 4, hourlyRate: 25 },
        { id: 2, name: 'Jane Smith', skills: ['Graphic Design', 'Content Writing'], rating: 5, hourlyRate: 40 },
        { id: 3, name: 'Alice Johnson', skills: ['App Development', 'Digital Marketing'], rating: 3, hourlyRate: 60 },
      ],
      filteredFreelancers: [],
      showModal: false,
      newProject: {
        name: '',
        description: '',
        skill: '',
        budget: ''
      }
    };
  },
  methods: {
    filterFreelancers() {
      this.filteredFreelancers = this.freelancers.filter(freelancer => {
        let skillMatch = this.selectedSkill ? freelancer.skills.includes(this.selectedSkill) : true;
        let ratingMatch = this.selectedRating ? freelancer.rating >= this.selectedRating : true;
        let hourlyRateMatch = this.selectedHourlyRate ? freelancer.hourlyRate <= this.selectedHourlyRate : true;
        return skillMatch && ratingMatch && hourlyRateMatch;
      });
    },
    openAddProjectModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    submitProject() {
  
      console.log('New Project Created:', this.newProject);
      this.closeModal();
    },
    viewProfile(freelancer) {
      this.$router.push({ name: 'freelancer-profile', params: { id: freelancer.id } });
    }
  },
  mounted() {
    this.filteredFreelancers = this.freelancers;
  }
};
</script>

<style scoped>
.client-dashboard {
  padding: 30px;
  background-color: #E1F0FF; 
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.filter-item {
  flex: 1;
  min-width: 150px;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #A9C8E7;
  background-color: #B0D1F3;
  color: #0F2573;
  font-size: 14px;
}

.add-project-btn {
  background-color: #0F2573;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-project-btn:hover {
  background-color: #A9C8E7;
}

.freelancer-listing {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.freelancer-card {
  width: 230px;
  border: 1px solid #A9C8E7;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
}

.freelancer-card:hover {
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.15);
  transform: translateY(-8px);
}

.skills {
  color: #0F2573;
  font-weight: bold;
  margin-bottom: 5px;
}

.rating .star {
  color: #A9C8E7;
  font-size: 18px;
}

.rating .star.filled {
  color: #0F2573;
}

.view-profile-btn {
  background-color: #0F2573;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.view-profile-btn:hover {
  background-color: #A9C8E7;
}

/* Modal */
.modal .form-control {
  margin-bottom: 20px;
  background-color: #B0D1F3;
  color: #0F2573;
  border: 1px solid #A9C8E7;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 15px;
  }

  .freelancer-card {
    width: 100%;
  }
}
</style>
 -->
<!--  <template>
  <div class="p-4">
    <h5 class="mb-3">Projects by Status</h5>
    <Pie :data="statusData" :options="chartOptions" style="height: 300px;" />

    <h5 class="mt-5 mb-3">Projects by Deadline</h5>
    <Bar :data="deadlineData" :options="chartOptionsBar" style="height: 300px;" />
  </div>
</template>

<script>
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

export default {
  components: {
    Pie,
    Bar,
  },
  data() {
    return {
      statusData: {
        labels: [],
        datasets: [
          {
            backgroundColor: ['#5E548E', '#9F86C0', '#BE95C4'],
            data: [],
          },
        ],
      },
      deadlineData: {
        labels: [],
        datasets: [
          {
            label: 'Projects',
            backgroundColor: '#041d56',
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
      chartOptionsBar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: { title: { display: true, text: 'Month' } },
          y: { title: { display: true, text: 'Projects' }, beginAtZero: true },
        },
      },
    }
  },
  async mounted() {
    const authStore = useAuthStore()
    const headers = { Authorization: `Bearer ${authStore.token}` }

    try {
      const statusRes = await axios.get('http://127.0.0.1:8000/api/charts/status', { headers })
      this.statusData.labels = statusRes.data.map(item => item.statut)
      this.statusData.datasets[0].data = statusRes.data.map(item => item.count)

      const deadlineRes = await axios.get('http://127.0.0.1:8000/api/charts/deadlines', { headers })
      this.deadlineData.labels = deadlineRes.data.map(item => item.month)
      this.deadlineData.datasets[0].data = deadlineRes.data.map(item => item.count)

      console.log('Status data:', statusRes.data)
      console.log('Deadline data:', deadlineRes.data)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  },
}
</script> -->

<!-- <script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const statusData = ref([])
const deadlineData = ref([])
const pieChartData = ref({
  labels: [],
  datasets: [],
})
const secondPieChartData = ref({
  labels: [],
  datasets: [],
})
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}
const BarchartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}

onMounted(async () => {

  const authStore = useAuthStore()
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const statusRes = await axios.get('http://127.0.0.1:8000/api/charts/status', { headers })
  statusData.value = statusRes.data 
  pieChartData.value = {
    labels: statusData.value.map(item => item.statut),
    datasets: [
      {
        label: 'Projects by Status',
        data: statusData.value.map(item => item.count),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], 
      },
    ],
  }
  const deadlineRes = await axios.get('http://127.0.0.1:8000/api/charts/deadlines', { headers })
  deadlineData.value = deadlineRes.data 
  secondPieChartData.value = {
    labels: deadlineData.value.map(item => item.month),
    datasets: [
      {
        label: 'Projects by Deadline',
        data: deadlineData.value.map(item => item.count),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], 
      },
    ],
  }
})
</script>

<template>
  <div class="charts-container">
    <div class="chart-card">
      <h5 class="chart-title">Projects by Status</h5>
      <Pie :data="pieChartData" :options="chartOptions" style="height: 160px;" />
    </div>
    <div class="chart-card">
      <h5 class="chart-title">Projects by Deadline</h5>
      <Pie :data="secondPieChartData" :options="chartOptions" style="height: 160px;" />
    </div>
  </div>
</template>


<style scoped>
.charts-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.chart-card {
  flex: 0 1 280px;
  max-width: 300px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: transform 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
}

.chart-title {
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}
</style>
 -->
<script setup>
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const statusData = ref([])
const deadlineData = ref([])

const pieChartData = ref({
  labels: [],
  datasets: [],
})

const secondPieChartData = ref({
  labels: [],
  datasets: [],
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}
const summary = ref({
  total: 0,
  completed: 0,
  ongoing: 0,
  pending: 0,
})

onMounted(async () => {
  const authStore = useAuthStore()
  const headers = { Authorization: `Bearer ${authStore.token}` }
  const userName = ref(authStore.user.name);
  const statusRes = await axios.get('http://127.0.0.1:8000/api/charts/status', { headers })
  statusData.value = statusRes.data

  pieChartData.value = {
    labels: statusData.value.map((item) => item.statut),
    datasets: [
      {
        label: 'Projects by Status',
        data: statusData.value.map((item) => item.count),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  }

  const deadlineRes = await axios.get('http://127.0.0.1:8000/api/charts/deadlines', { headers })
  deadlineData.value = deadlineRes.data

  secondPieChartData.value = {
    labels: deadlineData.value.map((item) => item.month),
    datasets: [
      {
        label: 'Projects by Deadline',
        data: deadlineData.value.map((item) => item.count),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  }
  const res = await axios.get('http://127.0.0.1:8000/api/projects/summary', { headers })
  const data = res.data

  let total = 0
  data.forEach((item) => {
    total += item.total
    const status = item.statut.toLowerCase()
    if (status === 'completed') summary.value.completed = item.total
    else if (status === 'in_progress') summary.value.in_progress = item.total
    else if (status === 'open') summary.value.open = item.total
  })
  summary.value.total = total
})
</script>

<template>
  <div class="dashboard-container">
    <div class="welcome-message">
      <h3>Welcome back, {{userName}}! 👋</h3>
      <p>Here’s what’s happening in your dashboard today.</p>
    </div>
    <div class="summary-container">
      <div class="summary-card">
        <h6>Total Projects</h6>
        <p>{{ summary.total }}</p>
      </div>
      <div class="summary-card">
        <h6>Completed</h6>
        <p>{{ summary.completed }}</p>
      </div>
      <div class="summary-card">
        <h6>In Progress</h6>
        <p>{{ summary.in_progress }}</p>
      </div>
      <div class="summary-card">
        <h6>Open</h6>
        <p>{{ summary.open }}</p>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h5 class="chart-title"><i class="fas fa-chart-pie"></i> Projects by Status</h5>
        <Pie :data="pieChartData" :options="chartOptions" style="height: 160px" />
      </div>
      <div class="chart-card">
        <h5 class="chart-title"><i class="fas fa-clock"></i> Projects by Deadline</h5>
        <Pie :data="secondPieChartData" :options="chartOptions" style="height: 160px" />
      </div>
    </div>

    <div class="activity-card">
      <h5 class="chart-title"><i class="fas fa-bolt"></i> Recent Activity</h5>
      <ul>
        <li>💼 Client A posted a new project</li>
        <li>✅ Project “UI Design” marked as completed</li>
        <li>📅 Deadline approaching for “Backend Refactor”</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 24px;
  background-color: #f8faff;
  min-height: 100vh;
}

.welcome-message {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-message h3 {
  margin: 0;
  font-size: 24px;
  color: #5e548e;
}

.welcome-message p {
  font-size: 14px;
  color: #666;
}

.summary-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.summary-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  flex: 0 1 150px;
}

.summary-card h6 {
  margin: 0;
  font-size: 14px;
  color: #5e548e;
}

.summary-card p {
  margin: 4px 0 0;
  font-size: 20px;
  font-weight: bold;
  color: #191627;
}

.charts-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 24px;
  background: linear-gradient(135deg, #f0f4ff, #fdfcff);
  border-radius: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.02);
}

.chart-card {
  flex: 0 1 280px;
  max-width: 300px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: transform 0.2s ease;
  animation: fadeIn 0.6s ease-in;
}

.chart-card:hover {
  transform: translateY(-4px);
}

.chart-title {
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}

.chart-title i {
  margin-right: 6px;
  color: #5e548e;
}

.activity-card {
  background: #fff;
  padding: 20px;
  margin-top: 24px;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 0.6s ease-in;
}

.activity-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-card li {
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
