<template>
  <div id="app">
    <nav class="menutable">
      <div class="logowrap">
        <router-link to="/" id="logo">{{ appTitle || "BANDCAL" }}</router-link>
      </div>
      <router-link
        class="menu"
        :class="{ active: isActive('/board') }"
        to="/board"
        >Board</router-link
      >
      <router-link
        class="menu"
        :class="{ active: isActive('/calendar') }"
        to="/calendar"
        >Calendar</router-link
      >
      <router-link
        class="menu"
        :class="{ active: isActive('/contacts') }"
        to="/contacts"
        >Contacts</router-link
      >
      <router-link
        class="menu"
        :class="{ active: isActive('/logout') }"
        to="/logout"
        @click.prevent="logout"
        >Logout</router-link
      >
    </nav>
    <div class="main">
      <router-view />
    </div>
    <footer class="footer">
      <small>
        <a
          href="https://github.com/tronstoner/bandcal"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          tronstoner's bandcal
        </a>
        {{ new Date().getFullYear() }}, all human rights reserved</small
      >
    </footer>
  </div>
</template>

<script lang="ts" setup>
const colorScheme = import.meta.env.VITE_APP_COLOR_SCHEME || "default";
console.log("colorScheme", colorScheme);
if (colorScheme === "alt") {
  import("./colors-alt.css");
} else {
  import("./colors.css");
}
import "./style.css";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const appTitle = import.meta.env.VITE_APP_TITLE || "BANDCAL";

const route = useRoute();
const router = useRouter();

const isActive = (path: string) => {
  return route.path.includes(path);
};

const logout = () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    import.meta.env.VITE_BASE_PATH || "/",
    true,
    "Derek",
    "Smalls"
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      router.push("/logout");
    }
  };
  xhr.send();
};
</script>

<style>
* {
  font-family: Roboto, sans-serif;
}

*:focus {
  outline: 0;
}
body,
html {
  background: var(--body-background-color);
  margin: 0;
  padding: 0;
  min-width: 300px;
}

#app {
  min-width: 320px;
}

form {
  margin-top: 1em;
}

.menutable,
.maintable {
  max-width: 1400px;
  min-width: 320px;
  margin: 0 auto;
  text-transform: uppercase;
}

.logowrap {
  display: inline-block;
  vertical-align: bottom;
}

a.menu {
  font-size: 120%;
  vertical-align: bottom;
  text-decoration: none;
  display: inline-block;
  padding: 0.2em 1em;
  border-radius: 8px 8px 0px 0px;
  background: var(--menu-background);
  margin-right: 4px;
}

a.menu:hover,
a.menu.active {
  text-decoration: none;
  background-color: var(--menu-active-background);
  color: var(--menu-active-color);
}

.menu:hover,
.menu.active {
  color: var(--menu-active-color);
}

#logo {
  font-size: 300%;
  font-weight: bold;
  display: block;
  white-space: nowrap;
  color: var(--logo-color);
  text-decoration: none;
  padding: 0 8px 0 8px;
  text-shadow: var(--logo-shadow) 4px 4px 0px;
  position: relative;
  top: 8px;
}

.main {
  max-width: 1400px;
  min-width: 320px;
  margin: 0 auto;
}

.footer {
  text-align: center;
  padding: 1em 0;
  background: var(--footer-background-color);
  color: var(--footer-color);
  font-size: 0.8em;
}

footer a {
  color: var(--footer-color);
}

@media (max-width: 850px) {
  a.menu {
    font-size: 100%;
    border-radius: 3px;
    background: var(--menu-background);
    margin: 0.2em 0.3em;
    padding: 0.3em;
    width: calc(50% - 0.6em);
  }

  .logowrap {
    font-size: 77%;
    display: block;
    margin-bottom: 0.5em;
  }

  .menutable {
    margin-bottom: 0.5em;
  }
}

@media (max-width: 320px) {
  .textfield a {
    word-wrap: break-word;
    max-width: 280px;
    overflow-wrap: break-word;
    overflow: hidden;
    display: inline-block;
  }
}
</style>
