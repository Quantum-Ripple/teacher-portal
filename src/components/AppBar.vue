<template>
  <header class="w-full bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between">
        
        <div class="flex items-center space-x-3">
          <button
            class="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="open menu"
            @click="$emit('menu-toggle')"
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span class="text-lg font-semibold" data-testid="app-title">{{ title }}</span>
        </div>

        
        <nav class="hidden md:flex items-center space-x-3">

          <router-link to="students" class="px-3 py-2 rounded-md hover:bg-gray-100">Students</router-link>
          <router-link to="announcements" class="px-3 py-2 rounded-md hover:bg-gray-100">Announcements</router-link>
          
          <button class="p-2 rounded-full hover:bg-gray-100" aria-label="profile">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </nav>

        
        <div class="md:hidden">
          <button class="p-2 rounded-md hover:bg-gray-100" @click="$emit('mobile-actions')" aria-label="more">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>



const props = defineProps({
  title: { type: String, default: 'My App' }
})
</script>