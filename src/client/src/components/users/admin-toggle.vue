<template>
  <v-checkbox
    v-bind="$attrs"
    :loading="loading"
    :input-value="user.admin"
    :disabled="sameUser"
    @change="toggle"
  />
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    sameUser() {
      return this.$store.state?.auth?.userId === this.user?.id;
    },
  },
  methods: {
    async toggle(admin) {
      this.loading = true;
      try {
        await this.$store.dispatch('users/patch', [this.user.id, { admin }]);
        this.$store.commit('showAlert', {
          text: admin
            ? `User ${this.user.username} is now an admin!`
            : `User ${this.user.username} is no longer an admin!`,
          color: 'success',
        });
        this.dialog = false;
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
      }
      this.loading = false;
    },
  },
};
</script>
