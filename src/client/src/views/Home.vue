<template>
  <v-row justify="center" align="center" class="full-height">
    <v-col cols="12" md="8" lg="6">
      <v-card flat outlined>
        <v-card-title class="mb-2 primary">
          Projects
          <v-spacer />
          <v-btn :loading="loading" class="mr-2" icon @click="reload">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <new-project-dialog />
        </v-card-title>
        <v-data-table
          :items="projects"
          :headers="headers"
        >
          <template #item.actions="{ item }">
            <project-actions :project="item"/>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import NewProjectDialog from '../components/projects/new-dialog.vue';
import ProjectActions from '../components/projects/actions.vue';

export default {
  components: {
    NewProjectDialog,
    ProjectActions,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters('projects', { projects: 'all' }),
    headers() {
      return [
        { value: 'name', text: 'Name' },
        { value: 'slug', text: 'Slug' },
        { value: 'state.Status', text: 'Status' },
        { value: 'actions', text: 'Actions' },
      ];
    },
  },
  methods: {
    async reload() {
      this.loading = true;
      await this.$store.dispatch('projects/all');
      this.loading = false;
    },
  },
  mounted() {
    this.reload();
  },
};
</script>
