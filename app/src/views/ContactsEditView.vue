<template>
  <div class="contacts-ed">
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name</label>
        <input id="name" v-model="contact.name" />
      </div>
      <div>
        <label for="text">Contact info</label>
        <textarea id="text" v-model="contact.text"></textarea>
      </div>
      <div class="form-actions">
        <div class="left-actions">
          <button type="submit">Save</button>
          <button type="button" class="secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
        <button
          v-if="contact.id !== null"
          type="button"
          class="danger"
          @click="confirmDelete"
        >
          Delete
        </button>
      </div>
    </form>
    <dialog ref="confirmDialog" class="confirm-dialog">
      <p>Are you sure you want to delete this contact?</p>
      <button class="danger" @click="deleteContact">Delete</button>
      <button class="secondary" @click="cancelDelete">Cancel</button>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const contact = ref({
  id: null,
  name: "",
  text: "",
});

const fetchContact = async (id: number) => {
  try {
    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch contact: ${response.statusText}`);
    }
    Object.assign(contact.value, await response.json());
  } catch (error) {
    console.error(error);
  }
};

const submitForm = async () => {
  const method = "POST";
  const url = "/api/contacts";
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact.value),
  };
  const response = await fetch(url, options);
  if (response.ok) {
    router.push("/contacts");
  } else {
    console.error("Failed to save contact");
  }
};

const cancelEdit = () => {
  router.push("/contacts");
};

const showDeleteConfirm = ref(false);
const confirmDialog = ref<HTMLDialogElement | null>(null);

const confirmDelete = () => {
  showDeleteConfirm.value = true;
  confirmDialog.value?.showModal();
};

const deleteContact = async () => {
  if (contact.value.id !== null) {
    try {
      const response = await fetch(`/api/contacts/${contact.value.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.statusText}`);
      }
      router.push("/contacts");
    } catch (error) {
      console.error(error);
    } finally {
      showDeleteConfirm.value = false;
      confirmDialog.value?.close();
    }
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  confirmDialog.value?.close();
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchContact(Number(id));
  }
});
</script>

<style scoped>
.contacts-ed {
  width: 100%;
  margin: 0 auto;
  background-color: #8cdaff;
  padding: 16px;
  border-radius: 8px;
}
label {
  display: block;
  margin-top: 1rem;
}
textarea {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
  min-height: 10rem;
}
button {
  padding: 0.5em 1em;
  margin-right: 0.5em;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 0.5em;
}

button.danger {
  background-color: #e74c3c;
  color: white;
}

button.danger:hover {
  background-color: #c0392b;
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
