<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div
        class="dashboard-content grid grid-cols-1 gap-5 2xl:grid-cols-[480px_minmax(0,1fr)_320px]"
      >
        <div class="space-y-5">
          <StatCards />
          <EmployeeStructure />
        </div>

        <RecruitmentOverview />
        <AttendanceOverview />
        <DepartmentDistribution />
        <EmployeeList />
        <TodayAttendance />
        <ApplicantList class="col-span-full" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import ApplicantList from './modules/applicant-list.vue'
  import AttendanceOverview from './modules/attendance-overview.vue'
  import DepartmentDistribution from './modules/department-distribution.vue'
  import EmployeeList from './modules/employee-list.vue'
  import EmployeeStructure from './modules/employee-structure.vue'
  import RecruitmentOverview from './modules/recruitment-overview.vue'
  import StatCards from './modules/stat-cards.vue'
  import TodayAttendance from './modules/today-attendance.vue'

  defineOptions({ name: 'DashboardHrm' })
</script>
