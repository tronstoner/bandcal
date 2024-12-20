<template>
  <div class="board" ref="boardRef">
    <div class="quick-post-form">
      <form @submit.prevent="quickPostMessage">
        <label for="quick-name">Name</label>
        <input
          type="text"
          id="quick-name"
          placeholder="Your name..."
          v-model="quickPost.name"
          required
        />

        <label for="quick-text">Text</label>
        <textarea
          id="quick-text"
          placeholder="Enter message..."
          v-model="quickPost.text"
          required
          rows="5"
        ></textarea>

        <button type="submit">Post message</button>
      </form>
    </div>
    <div class="board-list" ref="boardListRef">
      <div v-for="message in messages" :key="message.id" class="message-card">
        <div class="message-header">
          <div class="message-title">
            <h3>{{ message.name }}</h3>
            <div class="message-datetime">
              {{ formatDate(message.datetime) }}
              <span
                v-if="message.updated && message.updated !== message.datetime"
              >
                (Updated: {{ formatDate(message.updated) }})
              </span>
            </div>
          </div>
          <div class="message-actions">
            <button
              class="secondary"
              @click="message.id !== undefined && editMessage(message.id)"
              v-if="message.name.toLowerCase() === quickPost.name.toLowerCase()"
            >
              Edit
            </button>
            <button
              class="secondary"
              @click="message.id !== undefined && confirmDelete(message.id)"
              v-if="deletesEnabled"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-html="formatEntryText(message.text)"></div>
      </div>
    </div>
    <button
      v-if="hasMoreMessages"
      ref="loadMoreButton"
      @click="fetchMessages"
      :disabled="isLoading"
    >
      {{ isLoading ? "Loading..." : "Load More" }}
    </button>
    <dialog ref="confirmDialog" class="confirm-dialog">
      <p>Are you sure you want to delete this message?</p>
      <button class="danger" @click="deleteMessage">Delete</button>
      <button class="secondary" @click="cancelDelete">Cancel</button>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { formatEntryText } from "../utils";
import dayjs from "dayjs";

const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;

interface Message {
  id?: number;
  name: string;
  text: string;
  datetime?: string;
  updated?: string; // Add this property
}

const deletesEnabled = ref(false);

const messages = ref<Message[]>([]);
const cursor = ref<number | null>(null);
const hasMoreMessages = ref(true);
const router = useRouter();
const boardListRef = ref<HTMLElement | null>(null);

const quickPostName = useLocalStorage("quickPostName", "");
const quickPost = ref<Message>({ name: quickPostName.value, text: "" });

const loadMoreButton = ref<HTMLButtonElement | null>(null);
const isLoading = ref(false);

const fetchMessages = async () => {
  if (!hasMoreMessages.value || isLoading.value) return;

  isLoading.value = true;
  try {
    const response = await fetch(
      `${API_BASE_PATH}/messages?cursor=${cursor.value || ""}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    const newMessages = await response.json();
    if (newMessages.length < 10) {
      hasMoreMessages.value = false;
    }
    messages.value.push(...newMessages);
    if (newMessages.length > 0) {
      cursor.value = newMessages[newMessages.length - 1].id;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const quickPostMessage = async () => {
  try {
    quickPostName.value = quickPost.value.name; // Save name to local storage
    const response = await fetch(`${API_BASE_PATH}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quickPost.value),
    });
    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.statusText}`);
    }
    const newMessage = await response.json();
    messages.value.unshift(newMessage);
    quickPost.value = { name: quickPostName.value, text: "" };
  } catch (error) {
    console.error(error);
  }
};

const showDeleteConfirm = ref(false);
const messageToDelete = ref<number | null>(null);
const confirmDialog = ref<HTMLDialogElement | null>(null);

const editMessage = (id: number) => {
  router.push({ name: "BoardEdit", params: { id } });
};

const confirmDelete = (id: number) => {
  messageToDelete.value = id;
  showDeleteConfirm.value = true;
  confirmDialog.value?.showModal();
};

const deleteMessage = async () => {
  if (messageToDelete.value !== null) {
    try {
      const response = await fetch(
        `${API_BASE_PATH}/messages/${messageToDelete.value}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.statusText}`);
      }
      messages.value = messages.value.filter(
        (message) => message.id !== messageToDelete.value
      );
    } catch (error) {
      console.error(error);
    } finally {
      showDeleteConfirm.value = false;
      messageToDelete.value = null;
      confirmDialog.value?.close();
    }
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  messageToDelete.value = null;
  confirmDialog.value?.close();
};

const formatDate = (dateString?: string) => {
  return dateString ? dayjs(dateString).format("ddd DD. MMM. YYYY, HH:mm") : "";
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting) {
    fetchMessages();
  }
};

let observer: IntersectionObserver;

onMounted(() => {
  fetchMessages();
  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });
  if (loadMoreButton.value) {
    observer.observe(loadMoreButton.value);
  }
});

onUnmounted(() => {
  if (loadMoreButton.value) {
    observer.unobserve(loadMoreButton.value);
  }
  observer.disconnect();
});
</script>

<style scoped>
h3 {
  margin: 0 0 0.5rem;
}
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #8cdaff;
  border-radius: 8px;
}

.quick-post-form {
  width: 100%;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 0.2rem;
}

form {
  display: flex;
  flex-direction: column;
  button {
    align-self: flex-start; /* Add this line to make the button normal sized */
  }
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.message-card {
  background: #fff;
  border: 2px solid #8cdaff;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align to the top */
  min-height: 2rem;
}

.message-title {
  display: flex;
  align-items: flex-start; /* Align to the top */
  gap: 0.5rem;
}

.message-datetime {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 186%;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #060;
}

.message-actions {
  display: flex;
  align-items: flex-start; /* Align to the top */
  gap: 0.5rem;
}

.message-actions button {
  font-size: 88%;
  margin: 0px;
}

.confirm-dialog {
  border: none;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.confirm-dialog[open]::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
</style>
