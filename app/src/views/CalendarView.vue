<template>
  <div class="calendar">
    <table>
      <thead>
        <tr>
          <th colspan="7">
            <div class="navigation">
              <button class="prev" @click="changeMonth(-1)">
                <LeftArrowIcon />
              </button>
              <button class="current" @click="goToToday">
                {{ currentMonthYear }}
              </button>
              <button class="next" @click="changeMonth(1)">
                <RightArrowIcon />
              </button>
            </div>
          </th>
        </tr>

        <tr>
          <th v-for="day in daysOfWeek" :key="day" class="calendar-head">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]?.date">
          <td
            v-for="day in week"
            :key="day.date.toISOString()"
            class="caldate"
            :class="{
              'other-month': day.isOtherMonth,
              'current-day': isCurrentDay(day.date),
              'past-date': isPastDate(day.date),
            }"
            @click="handleDayClick(day.date)"
          >
            <div>
              <strong>{{ day.date.getDate() }}</strong>
            </div>
            <div
              v-for="entry in day.entries"
              :key="entry.id"
              v-html="formatEntryText(entry.text)"
            ></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { formatDate, formatEntryText } from "../utils";
import { apiFetch } from "../utils/api";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import LeftArrowIcon from "../components/LeftArrowIcon.vue";
import RightArrowIcon from "../components/RightArrowIcon.vue";

dayjs.extend(isoWeek);

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weeks = ref<any[]>([]);
const router = useRouter();
const route = useRoute();
const currentMonth = ref(new Date());

const currentMonthYear = computed(() => {
  return currentMonth.value.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
});

const fetchEntries = async (startDate: string, endDate: string) => {
  try {
    return await apiFetch(
      `/calendar?startdate=${startDate}&enddate=${endDate}`
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

const generateCalendar = async (month: Date) => {
  const monthDayjs = dayjs(month);
  const startOfMonth = monthDayjs.startOf("month");
  const endOfMonth = monthDayjs.endOf("month");
  const startDate = startOfMonth.startOf("isoWeek");
  const endDate = endOfMonth.endOf("isoWeek");

  const calendarEntries = await fetchEntries(
    formatDate(startDate.toDate()),
    formatDate(endDate.toDate())
  );

  const tempWeeks = [];
  let current = startDate;

  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      const dateString = formatDate(current.toDate());
      const entries = calendarEntries.filter(
        (entry: any) => entry.date === dateString
      );
      week.push({
        date: current.toDate(),
        isOtherMonth: current.month() !== monthDayjs.month(),
        entries: entries,
      });
      current = current.add(1, "day");
    }
    tempWeeks.push(week);
  }
  weeks.value = tempWeeks;
};

const handleDayClick = (date: Date) => {
  router.push({
    name: "CalendarEdit",
    params: { date: formatDate(date) },
  });
};

const changeMonth = (delta: number) => {
  currentMonth.value.setMonth(currentMonth.value.getMonth() + delta);
  router.push({
    name: "Calendar",
    params: { month: formatDate(currentMonth.value).slice(0, 7) },
  });
};

const goToToday = async () => {
  currentMonth.value = new Date();
  await generateCalendar(currentMonth.value);
  router.push({
    name: "Calendar",
    params: { month: formatDate(currentMonth.value).slice(0, 7) },
  });
};

const isCurrentDay = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day
  return date < today;
};

watch(route, async () => {
  const monthParam = route.params.month as string;
  currentMonth.value = monthParam ? new Date(`${monthParam}-01`) : new Date();
  await generateCalendar(currentMonth.value);
});

onMounted(async () => {
  const monthParam = route.params.month as string;
  currentMonth.value = monthParam ? new Date(`${monthParam}-01`) : new Date();
  await generateCalendar(currentMonth.value);
});
</script>

<style scoped>
.calendar {
  width: 100%;
  margin: auto;
  font-size: 100%;
}

table {
  width: 100%;
  background: var(--background-color);
  border-spacing: 4px; /* This sets the cellpadding */
  border-radius: 8px;
  padding: 4px;
}

th,
td {
  padding: 4px;
  vertical-align: top;
  text-align: left;
}

td.caldate {
  border-style: solid;
  border-color: transparent;
  border-width: 2px;
  font-size: 88%;
  border-collapse: collapse;
  background-color: var(--dialog-background);
  border-radius: 8px;
  height: 6.5em;
  width: 14.28%; /* Ensure all days have equal width without fixed width */
}

td.caldate:hover {
  text-decoration: none;
  background: var(--button-background);
  color: var(--button-color);
  cursor: pointer;
}

td.caldate:hover a {
  font-weight: bold;
  color: var(--button-color);
}

td.past-date {
  background-color: var(--past-background);
  color: var(--past-color);
}

td.other-month,
td.other-month:hover {
  background-color: transparent;
  opacity: 0.9;
  color: var(--button-color);
}

td.current-day {
  border-color: var(--active-color);
  outline: var(--active-color) 4px solid;
  background-color: var(--dialog-background);
}

.calendar-head {
  font-size: 77%;
}

.button {
  font-size: 120%;
  border: none;
  text-decoration: none;
  padding: 8px 12px;
  border-collapse: collapse;
  background: var(--button-background);
  font-weight: bold;
  color: var(--button-color);
  border-radius: 6px;
  cursor: pointer;
}

.button:hover {
  color: var(--button-color);
  background: var(--button-hover-background);
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Ensure vertical alignment */
  margin-bottom: 1rem;
  text-align: center;
}
.navigation button {
  margin: 0 0.2rem;
  display: flex;
  align-items: center; /* Center the icons vertically */
  justify-content: center; /* Center the icons horizontally */
  height: 2.4rem;
}
.navigation button.current {
  width: 100%;
}
.navigation button.prev,
.navigation button.next {
  margin: 0;
  width: 100%;
}

@media (max-width: 640px) {
  table td.caldate {
    font-size: 77%;
  }
}

@media (max-width: 600px) {
  .navigation button.current {
    font-size: 80%;
    width: 100%;
  }
  .navigation button.prev,
  .navigation button.next {
    margin: 0;
    width: 60%;
  }
}

@media (max-width: 400px) {
  .navigation button.prev,
  .navigation button.next {
    margin: 0;
    width: 60%;
  }
}
</style>
