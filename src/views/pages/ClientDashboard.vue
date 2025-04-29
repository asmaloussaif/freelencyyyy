<template>
    <div class="client-dashboard">
      <!-- Filter Bar -->
      <div class="filter-bar">
        <select v-model="selectedSkill" @change="filterFreelancers">
          <option value="">Select Skill</option>
          <option v-for="skill in skills" :key="skill" :value="skill">{{ skill }}</option>
        </select>
        <select v-model="selectedRating" @change="filterFreelancers">
          <option value="">Select Rating</option>
          <option v-for="rating in ratings" :key="rating" :value="rating">{{ rating }} & Up</option>
        </select>
        <button @click="addNewProject">Add New Project</button>
      </div>
  
      <!-- Freelancer Listings -->
      <div class="freelancer-listing">
        <div v-for="freelancer in filteredFreelancers" :key="freelancer.id" class="freelancer-card">
          <h3>{{ freelancer.name }}</h3>
          <p>{{ freelancer.skills.join(', ') }}</p>
          <p>Rating: {{ freelancer.rating }}</p>
          <button @click="viewProfile(freelancer)">View Profile</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        skills: ['Web Development', 'Graphic Design', 'App Development', 'Content Writing'], // Example skills
        ratings: [1, 2, 3, 4, 5],
        selectedSkill: '',
        selectedRating: '',
        freelancers: [ /* Array of freelancers data */ ],
        filteredFreelancers: []
      };
    },
    methods: {
      filterFreelancers() {
        this.filteredFreelancers = this.freelancers.filter(freelancer => {
          let skillMatch = this.selectedSkill ? freelancer.skills.includes(this.selectedSkill) : true;
          let ratingMatch = this.selectedRating ? freelancer.rating >= this.selectedRating : true;
          return skillMatch && ratingMatch;
        });
      },
      addNewProject() {
        this.$router.push({ name: 'add-project' });
      },
      viewProfile(freelancer) {
        this.$router.push({ name: 'freelancer-profile', params: { id: freelancer.id } });
      }
    },
    mounted() {
      this.filteredFreelancers = this.freelancers; // Initial load
    }
  };
  </script>
  
  <style scoped>
  .client-dashboard {
    padding: 20px;
  }
  
  .filter-bar {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .freelancer-listing {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .freelancer-card {
    width: 220px;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 5px;
    background-color: #f8fafa;
    transition: box-shadow 0.3s;
  }
  
  .freelancer-card:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  