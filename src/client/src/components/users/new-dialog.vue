<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <v-btn color="secondary" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Add User
      </v-btn>
    </template>
    <v-card flat outlined>
      <v-card-title class="mb-2 primary">
        Create User
      </v-card-title>
      <v-card-text class="pt-4">
        <v-text-field
          v-model.trim="user.username"
          label="Username"
          outlined
          autofocus
          autocomplete="off"
        />
        <password
          v-model="user.password"
          label="Password"
          @keydown.enter.stop="create"
          autocomplete="off"
        />
        <v-checkbox
          v-model="user.admin"
          label="Admin Permissions?"
        />
        <v-row class="mx-0">
          <v-spacer />
          <v-btn
            :disabled="!user.username || !user.password"
            :loading="loading"
            color="secondary"
            depressed
            primary
            @click="create"
          >
            Create
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Password from '../input/password.vue';

const defaultUser = {
  username: '',
  password: '',
  admin: false,
};

export default {
  components: {
    Password,
  },
  data() {
    return {
      user: { ...defaultUser },
      loading: false,
      dialog: false,
    };
  },
  methods: {
    async create() {
      if (!this.user.username || !this.user.password) return;
      this.loading = true;
      try {
        await this.$store.dispatch('users/create', this.user);
        this.$store.commit('showAlert', { text: `User ${this.user.username} was successfully created!`, color: 'success' });
        this.user = { ...defaultUser };
        this.dialog = false;
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
      }
      this.loading = false;
    },
  },
};
</script>
