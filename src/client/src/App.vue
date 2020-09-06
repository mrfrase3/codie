<template>
  <v-app>
    <nav-bar />
    <v-main>
      <router-view/>
    </v-main>
    <v-snackbar
      v-model="$store.state.alert.show"
      :color="$store.state.alert.color"
      bottom
      right
      @input="$store.commit('hideAlert')"
    >
      {{ $store.state.alert.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import NavBar from './components/navbar.vue';

export default {
  name: 'App',

  components: {
    NavBar,
  },

  data: () => ({
    //
  }),
};
</script>
