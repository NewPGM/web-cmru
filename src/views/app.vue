<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    <p class="mb-4">Welcome to the admin dashboard.</p>
    <p class="mb-4">You are logged in as {{ $store.state.user.username }}.</p>
    <router-link class="text-blue-500" to="/logout">Logout</router-link>
  </div>
</template>

<script>
export default {
  name: 'App_main',
}
</script>
