<template>
    <Bar :data="data" :options="options" />
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs'
  import { defineProps } from 'vue'
  
  defineProps({
    data: Object,
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Projects by Deadline',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }),
    },
  })
  </script>
  