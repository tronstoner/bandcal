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
  xhr.open("GET", "/", true, "Derek", "Smalls");
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
  background: #fff;
  margin: 0;
  padding: 0;
  min-width: 300px;
}

form {
  margin-top: 1em;
}

.menutable,
.maintable {
  max-width: 1400px;
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
  background: #eee;
  margin-right: 4px;
}

a.menu:hover,
a.menu.active {
  text-decoration: none;
  background-color: #8cdaff;
  color: #fff;
}

.menu:hover,
.menu.active {
  color: #fff;
}

#logo {
  font-size: 300%;
  font-weight: bold;
  display: block;
  white-space: nowrap;
  color: #46abdb;
  text-decoration: none;
  padding: 0 8px 0 8px;
  text-shadow: #e6e6e6 4px 4px 0px;
  position: relative;
  top: 8px;
}

.main {
  max-width: 1400px;
  margin: 0 auto;
}

.footer {
  text-align: center;
  padding: 1em 0;
  background: #fff;
  color: #666;
  font-size: 0.8em;
}

@media (max-width: 850px) {
  a.menu {
    font-size: 100%;
    border-radius: 3px;
    background: #eee;
    margin: 0.2em 0.3em;
    padding: 0.3em;
    width: calc(50% - 1.2em);
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
