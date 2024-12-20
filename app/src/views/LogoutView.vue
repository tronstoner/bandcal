<template>
  <div class="logout-container">
    <div>You have been logged out...</div>
    <a href="/board" class="return-button">Log in again</a>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { apiFetch } from "../utils/api";

onMounted(async () => {
  try {
    const data = await apiFetch("/ping");
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
  background: var(--background-color);
}

.return-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--button-background);
  color: var(--button-color);
  text-decoration: none;
  border-radius: 4px;
}

.return-button:hover {
  color: var(--button-color);
  background: var(--button-hover-background);
}
</style>
