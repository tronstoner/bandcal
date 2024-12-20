<template>
  <div class="calendar-ed">
    <form @submit.prevent="submitForm">
      <div>
        <label for="text">{{ formattedDate }}</label>
        <textarea
          id="text"
          class="textfield"
          placeholder="Enter your times, like: '10:00-12:00 Spinal Tap'..."
          v-model="calendarEntry.text"
        ></textarea>
      </div>
      <button type="submit">Save</button>
      <button type="button" class="secondary" @click="cancelEdit">
        Cancel
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiFetch } from "../utils/api";

const route = useRoute();
const router = useRouter();
const calendarEntry = ref({
  date: "",
  text: "",
});

onMounted(async () => {
  const date = route.params.date;
  if (date) {
    calendarEntry.value.date = Array.isArray(date) ? date[0] : date;
    try {
      const entry = await apiFetch(`/calendar/${date}`);
      calendarEntry.value = entry;
    } catch (error: any) {
      if (error.response && error.response.status !== 404) {
        console.error(error);
      }
    }
  }
});

const formattedDate = computed(() => {
  return dayjs(calendarEntry.value.date).format("ddd DD. MMM. YYYY");
});

const submitForm = async () => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendarEntry.value),
  };
  try {
    await apiFetch("/calendar", options);
    router.back();
  } catch (error) {
    router.push("/calendar");
  }
};

const cancelEdit = () => {
  router.back();
};
</script>

<style scoped>
.calendar-ed {
  width: 100%;
  margin: 0 auto;
  background-color: var(--background-color);
  padding: 16px;
  border-radius: 8px;
}
form div {
  margin-bottom: 1em;
}
label {
  font-size: 100%;
  margin-bottom: 0.5rem;
  display: block;
}
textarea {
  max-width: 70rem;
  min-height: 10rem;
  padding: 0.5em;
  box-sizing: border-box;
}
button {
  padding: 0.5em 1em;
  margin-right: 0.5em;
}
</style>
