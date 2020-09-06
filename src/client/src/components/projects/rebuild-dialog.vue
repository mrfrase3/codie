<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-star-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Rebuild
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card flat outlined>
      <v-card-title class="mb-2 primary">
        Rebuild Project
      </v-card-title>
      <v-card-text class="pt-4">
        <p>
          This will remove and rebuild the code container.
          Any data outside the home directory will be lost.
        </p>
        <p>
          Are you sure you want to do this?
          Please enter the project name,
          <code>{{project.name}}</code>,
          to confirm.
        </p>
        <v-text-field
          v-model.trim="name"
          label="Project Name"
          outlined
          autofocus
          autocomplete="off"
        />
        <v-row class="mx-0">
          <v-spacer />
          <v-btn
            :disabled="name !== project.name"
            :loading="loading"
            color="secondary"
            depressed
            primary
            @click="rebuild"
          >
            Rebuild
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      name: '',
      loading: false,
      dialog: false,
    };
  },
  methods: {
    async rebuild() {
      if (this.name !== this.project.name) return;
      this.loading = true;
      try {
        await this.$store.dispatch('projects/power', [this.project.id, 'rebuild']);
        this.$store.commit('showAlert', { text: `Project ${this.name} was successfully rebuilt!`, color: 'success' });
        this.name = '';
        this.dialog = false;
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
      }
      this.loading = false;
    },
  },
  watch: {
    dialog(to, from) {
      if (to === from || to) return;
      this.name = '';
    },
  },
};
</script>
