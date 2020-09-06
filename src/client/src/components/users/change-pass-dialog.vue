<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn color="secondary" v-on="on">
          <v-icon left>mdi-plus</v-icon>
          Change Password
        </v-btn>
      </slot>
    </template>
    <v-card flat outlined>
      <v-card-title class="mb-2 primary">
        Change Password for {{user.username}}
      </v-card-title>
      <v-card-text class="pt-4">
        <password
          v-model="password"
          label="Password"
          @keydown.enter.stop="update"
          autocomplete="off"
        />
        <v-row class="mx-0">
          <v-spacer />
          <v-btn
            :disabled="!password"
            :loading="loading"
            color="secondary"
            depressed
            primary
            @click="update"
          >
            Update
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Password from '../input/password.vue';

export default {
  components: {
    Password,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      password: '',
      loading: false,
      dialog: false,
    };
  },
  methods: {
    async update() {
      if (!this.password) return;
      this.loading = true;
      try {
        await this.$store.dispatch('users/patch', [this.user.id, { password: this.password }]);
        this.$store.commit('showAlert', { text: `User ${this.user.username} was successfully updated!`, color: 'success' });
        this.password = '';
        this.dialog = false;
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
      }
      this.loading = false;
    },
  },
};
</script>
