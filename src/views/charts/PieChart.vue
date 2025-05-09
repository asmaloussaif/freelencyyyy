<template>
    <Pie :data="data" :options="options" />
  </template>
  
  <script setup>
  import { Pie } from 'vue-chartjs'
  import { defineProps } from 'vue'
  
  defineProps({
    data: Object,
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Projects by Status',
          },
        },
      }),
    },
  })
  </script>
  