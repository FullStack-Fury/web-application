<script>
import LanguageSwitcher from "./public/components/language-switcher.component.vue";

export default {
  name: 'app',
  components: {LanguageSwitcher},
  title: 'GemZ ',
  data() {
    return {
      drawer: false,
      items: [
        {label: this.$t('navbar.management'), to: '/management'},
        {label: this.$t('navbar.inventory'), to: '/inventory/materials'},
        {label: this.$t('navbar.dashboard'), to: '/dashboard'}
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
}

</script>

<template>

  <pv-toast/>
  <header>
    <pv-toolbar class="bg-primary">
      <template #start>
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
        <img class="logo" src="/logo-color.png" alt="logo gem z">
      </template>

      <template #center>
        <div class="flex-column">
          <router-link v-for="item in items" :key="item.label" v-slot="{navigate, href}" :to="item.to" custom>
            <pv-button :href="href" class="p-button-text" @click="navigate">{{ item.label }}</pv-button>
          </router-link>
        </div>
      </template>
      
      <template #end>
        <language-switcher/>
      </template>
    </pv-toolbar>
    <pv-drawer v-model:visible="drawer"/>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<style scoped>

.logo {
  width: 50px;
}

</style>
