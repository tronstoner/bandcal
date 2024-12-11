<template>
  <div class="logout-container">
    <div>You have been logged out...</div>
    <a href="/board" class="return-button">Log in again</a>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(async () => {
  try {
    const response = await fetch("/api/ping");
    const data = await response.text();
    if (data === "pong") {
      window.location.href = "/";
    }
  } catch (error) {
    window.location.href = "/";
  }
});
</script>

<style scoped>
.logout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #8cdaff;
}

.return-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2691c4;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.return-button:hover {
  color: #fff;
  background: #175b7b;
}
</style>
