<template>
  <div class="client-dashboard">
    <!-- Filter Bar -->
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

    <!-- Freelancer Listings -->
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

    <!-- Modal for Adding a New Project -->
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
      // Handle the submission of the new project
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
  background-color: #E1F0FF; /* Light blue background */
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
