import { createRouter, createWebHistory } from "vue-router";
import CalendarView from "../views/CalendarView.vue";
import ContactsView from "../views/Contacts.vue";
import CalendarEditView from "../views/CalendarEditView.vue";
import IndexView from "../views/IndexView.vue";
import ContactsEditView from "../views/ContactsEditView.vue";
import BoardView from "../views/Board.vue";
import BoardEditView from "../views/BoardEditView.vue";
import LogoutView from "../views/LogoutView.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: IndexView,
  },
  {
    path: "/calendar/:month?",
    name: "Calendar",
    component: CalendarView,
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: ContactsView,
  },
  {
    path: "/calendar/edit/:date",
    name: "CalendarEdit",
    component: CalendarEditView,
  },
  {
    path: "/contacts/edit/:id?",
    name: "ContactsEdit",
    component: ContactsEditView,
  },
  {
    path: "/board",
    name: "Board",
    component: BoardView,
  },
  {
    path: "/board/edit/:id?",
    name: "BoardEdit",
    component: BoardEditView,
  },
  {
    path: "/logout",
    name: "Logout",
    component: LogoutView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH || "/"),
  routes,
});

export default router;
