<template>
  <v-row justify="center" align="center" class="full-height">
    <v-col cols="12" md="6" lg="4">
      <v-card flat outlined>
        <v-card-title class="mb-2 primary">
          Login
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            v-model.trim="username"
            label="Username"
            outlined
            autofocus
          />
          <password
            v-model="password"
            label="Password"
            @keydown.enter.stop="login"
          />
          <v-row class="mx-0">
            <v-spacer />
            <v-btn
              :disabled="!username || !password"
              :loading="loading"
              color="secondary"
              depressed
              primary
              @click="login"
            >
              Login
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Password from '../components/input/password.vue';

export default {
  components: {
    Password,
  },
  data() {
    return {
      username: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) return;
      this.loading = true;
      try {
        await this.$store.dispatch('auth/login', { username: this.username, password: this.password });
        if (this.$route.query?.followPath?.includes('http')) {
          window.location.href = this.$route.query?.followPath;
        } else {
          this.$router.push(this.$route.query?.followPath || '/');
        }
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
        this.loading = false;
      }
    },
  },
};
</script>
