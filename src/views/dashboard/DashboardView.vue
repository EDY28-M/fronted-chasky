<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 min-w-0">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 truncate">Good Morning, Sensei.</h1>
        <p class="text-text-muted mt-1 text-xs sm:text-sm">Here is what's happening at the dojo today.</p>
      </div>
      <router-link
        :to="{ name: 'Students' }"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors tracking-wide uppercase shrink-0"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Alumnos
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        class="stats-card bg-surface rounded-lg p-4 sm:p-6 shadow-card border border-gray-100 flex flex-col justify-between min-h-[120px] sm:min-h-[128px] lg:h-32 relative overflow-hidden group"
      >
        <div class="absolute right-0 top-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span class="material-symbols-outlined text-6xl sm:text-8xl text-primary transform rotate-12">groups</span>
        </div>
        <div class="flex justify-between items-start z-10 gap-2">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider truncate">Active Students</p>
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mt-0.5 sm:mt-1">142</h3>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            +4%
          </span>
        </div>
        <div class="mt-4 z-10">
          <div class="w-full bg-gray-100 rounded-full h-1.5">
            <div class="bg-primary h-1.5 rounded-full" style="width: 70%" />
          </div>
          <p class="text-[10px] text-gray-400 mt-1 text-right">Target: 200</p>
        </div>
      </div>
      <div
        class="stats-card bg-surface rounded-lg p-4 sm:p-6 shadow-card border border-gray-100 flex flex-col justify-between min-h-[120px] sm:min-h-[128px] lg:h-32 relative overflow-hidden group"
      >
        <div class="absolute right-0 top-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span class="material-symbols-outlined text-6xl sm:text-8xl text-primary transform rotate-12">check_circle</span>
        </div>
        <div class="flex justify-between items-start z-10 gap-2">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider truncate">Attendance Rate</p>
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mt-0.5 sm:mt-1">87%</h3>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            +2.5%
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-2 z-10">Average of 12 students per class.</p>
      </div>
      <div
        class="stats-card bg-surface rounded-lg p-4 sm:p-6 shadow-card border border-gray-100 flex flex-col justify-between min-h-[120px] sm:min-h-[128px] lg:h-32 relative overflow-hidden group sm:col-span-2 lg:col-span-1"
      >
        <div class="absolute right-0 top-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span class="material-symbols-outlined text-6xl sm:text-8xl text-primary transform rotate-12">military_tech</span>
        </div>
        <div class="flex justify-between items-start z-10 gap-2">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider truncate">Eligible for Belt</p>
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mt-0.5 sm:mt-1">8</h3>
          </div>
          <span
            class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-primary cursor-pointer"
          >
            <span class="material-symbols-outlined text-[14px]">notifications</span>
          </span>
        </div>
        <div class="mt-2 flex -space-x-2 z-10">
          <div
            v-for="initials in ['JD', 'SM', 'KL']"
            :key="initials"
            class="h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
          >
            {{ initials }}
          </div>
          <div
            class="h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 text-[10px]"
          >
            +5
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <!-- Today's Schedule -->
      <div class="xl:col-span-2 bg-surface rounded-lg shadow-soft border border-gray-100 overflow-hidden min-w-0">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 class="text-base sm:text-lg font-serif font-bold text-gray-900 truncate">Today's Class Schedule</h3>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs sm:text-sm text-gray-500">Oct 24, 2023</span>
            <button type="button" class="text-primary hover:text-primary-dark p-1">
              <span class="material-symbols-outlined">calendar_today</span>
            </button>
          </div>
        </div>
        <div class="divide-y divide-gray-50">
          <DashboardClassItem
            time="16:00"
            title="Little Ninjas (Ages 4-6)"
            location="Main Dojo Floor"
            instructor="Sensei Kenji"
            status="Active"
            status-class="bg-green-100 text-green-800"
          />
          <DashboardClassItem
            time="17:30"
            title="Beginner Shotokan"
            location="Main Dojo Floor"
            instructor="Takeshi Kovacs"
            status="Starting Soon"
            status-class="bg-yellow-100 text-yellow-800"
            highlight
            action="Check In"
          />
          <DashboardClassItem
            time="19:00"
            title="Advanced Black Belt"
            location="Dojo B"
            instructor="Master Sato"
            status="Upcoming"
            status-class="bg-gray-100 text-gray-600"
            muted
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4 sm:space-y-6 min-w-0">
        <div class="bg-surface rounded-lg shadow-soft border border-gray-100 p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-serif font-bold text-gray-900 mb-3 sm:mb-4">Dojo Notices</h3>
          <ul class="space-y-4">
            <li class="flex items-start">
              <span class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-primary" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Holiday Schedule</p>
                <p class="text-xs text-gray-500 mt-0.5">Dojo closed on Nov 1st for All Saints Day.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-gray-300" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">New Equipment Arrival</p>
                <p class="text-xs text-gray-500 mt-0.5">Tatami mats replacement scheduled for next weekend.</p>
              </div>
            </li>
          </ul>
          <button
            type="button"
            class="mt-4 w-full text-center text-xs text-primary hover:text-primary-dark font-medium uppercase tracking-wide transition-colors"
          >
            View All Notices
          </button>
        </div>
        <div class="bg-surface rounded-lg shadow-soft border border-gray-100 p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-serif font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
          <div class="flow-root">
            <ul class="-mb-8">
              <li>
                <div class="relative pb-8">
                  <span
                    aria-hidden="true"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  />
                  <div class="relative flex space-x-3">
                    <span
                      class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white"
                    >
                      <span class="material-symbols-outlined text-green-600 text-[16px]">payments</span>
                    </span>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <p class="text-sm text-gray-500">
                        Payment received from <a href="#" class="font-medium text-gray-900">Sarah C.</a>
                      </p>
                      <span class="text-right text-xs whitespace-nowrap text-gray-500">1h ago</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="relative pb-8">
                  <div class="relative flex space-x-3">
                    <span
                      class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white"
                    >
                      <span class="material-symbols-outlined text-blue-600 text-[16px]">person_add</span>
                    </span>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <p class="text-sm text-gray-500">
                        New registration <a href="#" class="font-medium text-gray-900">Mike R.</a>
                      </p>
                      <span class="text-right text-xs whitespace-nowrap text-gray-500">3h ago</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardClassItem from '@/components/dashboard/DashboardClassItem.vue'
</script>
