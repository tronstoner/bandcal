<template>
  <div class="board-edit">
    <h2>{{ isEditing ? "Edit Message" : "Add Message" }}</h2>
    <form @submit.prevent="saveMessage">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="message.name" required />

      <label for="text">Text</label>
      <textarea id="text" v-model="message.text" required></textarea>

      <button type="submit">{{ isEditing ? "Update" : "Create" }}</button>
      <button type="button" class="secondary" @click="cancelEdit">
        Cancel
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiFetch } from "../utils/api";

interface Message {
  id?: number;
  name: string;
  text: string;
}

const route = useRoute();
const router = useRouter();
const message = ref<Message>({ name: "", text: "" });
const isEditing = ref(false);

const fetchMessage = async (id: number) => {
  try {
    message.value = await apiFetch(`/messages/${id}`);
    isEditing.value = true;
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message.value),
  };
  try {
    await apiFetch("/messages", options);
    router.push({ name: "Board" });
  } catch (error) {
    console.error(error);
  }
};

const cancelEdit = () => {
  router.push({ name: "Board" });
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchMessage(Number(id));
  }
});
</script>

<style scoped>
.board-edit {
  margin: 0 auto;
  padding: 1rem;
  background: #8cdaff;
  border-radius: 8px;
}

textarea {
  height: 10rem;
}
</style>
