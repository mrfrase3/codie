<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <v-btn color="secondary" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Add Project
      </v-btn>
    </template>
    <v-card flat outlined>
      <v-card-title class="mb-2 primary">
        Create Project
      </v-card-title>
      <v-card-text class="pt-4">
        <v-text-field
          v-model.trim="name"
          label="Name"
          outlined
          autofocus
          autocomplete="off"
        />
        <v-autocomplete
          v-model="scripts"
          :items="scriptItems"
          label="Initialise With"
          outlined
          multiple
          chips
          deletable-chips
        />
        <v-row class="mx-0">
          <v-spacer />
          <v-btn
            :disabled="!name"
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
import capitalize from 'lodash/capitalize';

export default {
  data() {
    return {
      name: '',
      loading: false,
      dialog: false,
      startScripts: {},
      scripts: [],
    };
  },
  computed: {
    scriptItems() {
      return Object.keys(this.startScripts).map((value) => ({
        value,
        text: capitalize(value.replace(/_/g, ' ')),
        disabled: this.startScripts[value].incompatible?.some((incom) => this.scripts.includes(incom)),
      }));
    },
  },
  methods: {
    async create() {
      if (!this.name) return;
      this.loading = true;
      try {
        await this.$store.dispatch('projects/create', { name: this.name, scripts: this.scripts });
        this.$store.commit('showAlert', { text: `Project ${this.name} was successfully created!`, color: 'success' });
        this.name = '';
        this.dialog = false;
      } catch (err) {
        this.$store.commit('showAlert', { text: err.message, color: 'error' });
      }
      this.loading = false;
    },
    async getScripts() {
      this.startScripts = await this.$store.dispatch('projects/scripts');
    },
  },
  mounted() {
    this.getScripts();
  },
};
</script>
