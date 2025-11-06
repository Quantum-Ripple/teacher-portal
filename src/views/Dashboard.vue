<template>
    <div>
        <StatDashboard/>
        <AttendanceDashboard/>
        <PerformanceDashboard/>
    </div>
</template>


<script setup>
import AttendanceDashboard from '../components/dashboard/AttendanceDashboard.vue';
import StatDashboard from '../components/dashboard/StatDashboard.vue';
import PerformanceDashboard from '../components/dashboard/PerformanceDashboard.vue';
</script>