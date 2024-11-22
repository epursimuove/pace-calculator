<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onMounted, version as vueVersion } from "vue";
import { version as appVersion } from "../package.json";

const currentYear: number = new Date().getFullYear();

onMounted(() => {
  console.info(`App component is mounted`);
  console.info(`Using Vue ${vueVersion}`);
});
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Calculator</RouterLink>
        <RouterLink to="/documentation">Documentation</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <footer>
    <div>
      <div>
        NNM Pace Calculator <var>{{ appVersion }}</var>
      </div>
      <div>Vue: {{ vueVersion }}</div>
      <div>
        <a href="https://github.com/epursimuove/pace-calculator">Source code</a>
        at GitHub.
      </div>
      <div>
        Copyright &copy; 2002-{{ currentYear }}
        <a href="https://anders.nemonisimors.com">Anders Gustafson</a>. All
        rights reserved.
      </div>
      <div>
        <a href="https://www.nemonisimors.com">
          <em>Nemo nisi mors</em>
        </a>
      </div>
    </div>

    <div>
      <a href="https://www.nemonisimors.com">
        <img
          alt="NNM logo"
          class="logo"
          src="/favicon-nnm-morse-code-2.svg"
          width="32"
          height="32"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped>
header {
  max-height: 100vh;
  margin-block-end: 1rem;
}

footer {
  margin-block-start: 3rem;
  border-block-start: 1px solid var(--color-footer);
  font-size: 0.85rem;
  color: var(--color-footer);

  display: flex;
  flex-direction: column;

  & a {
    color: var(--color-footer);
  }
}

nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-block: 0.5rem 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
  text-decoration: none;
}

nav a {
  display: inline-block;
  /*text-transform: uppercase;*/
}

@media (min-width: 600px) {
  footer {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
