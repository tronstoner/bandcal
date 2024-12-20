<template>
  <div class="contacts">
    <div class="contacts-list">
      <div
        v-for="contact in sortedContacts"
        :key="contact.id"
        class="contact-card"
      >
        <div class="contact-header">
          <h3>{{ contact.name }}</h3>
          <div class="contact-actions">
            <button @click="editContact(contact.id)">Edit</button>
          </div>
        </div>
        <div v-html="formatEntryText(contact.text)"></div>
      </div>
      <div class="contact-card add-contact-card" @click="addContact">
        <span>+</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { formatEntryText } from "../utils";
import { apiFetch } from "../utils/api";

interface Contact {
  id: number;
  name: string;
  text: string;
}

const contacts = ref<Contact[]>([]);
const router = useRouter();

const fetchContacts = async () => {
  try {
    contacts.value = await apiFetch("/contacts");
  } catch (error) {
    console.error(error);
  }
};

const addContact = () => {
  router.push({ name: "ContactsEdit" });
};

const editContact = (id: number) => {
  router.push({ name: "ContactsEdit", params: { id } });
};

const sortedContacts = computed(() => {
  return contacts.value
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
});

onMounted(() => {
  fetchContacts();
});
</script>

<style scoped>
h3 {
  margin: 0;
}
.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: var(--background-color);
  border-radius: 8px;
}

.contacts-list {
  display: grid;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 600px) {
  .contacts-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .contacts-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.contact-card {
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  border: 2px solid var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; /* Add margin to separate from content */
}

.contact-actions {
  display: flex;
  gap: 8px;
}

.contact-actions button {
  font-size: 88%;
  margin: 0px;
}

.add-contact-card {
  display: flex;
  font-size: 200%;
  justify-content: center;
  align-items: center;
  background: var(--add-card-background);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.add-contact-card:hover {
  background: var(--add-card-hover-background);
}

.confirm-dialog {
  border: none;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  background: var(--dialog-background);
}

.confirm-dialog[open]::backdrop {
  background: var(--dialog-backdrop);
}

.button {
  font-size: 100%;
  border: none;
  padding: 8px 12px;
  background: var(--add-card-background);
  font-weight: bold;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.button:hover {
  background: var(--add-card-hover-background);
}
</style>
