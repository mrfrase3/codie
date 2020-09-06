<template>
  <div>
    <div v-show="project.state.Status === 'running'">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn :loading="loading === 'stop'" icon @click="action('stop')" v-on="on">
            <v-icon>
              mdi-stop-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Stop</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn :loading="loading === 'restart'" icon @click="action('restart')" v-on="on">
            <v-icon>
              mdi-restart
            </v-icon>
          </v-btn>
        </template>
        <span>Restart</span>
      </v-tooltip>
      <v-menu offset-y close-on-click>
        <template #activator="{ on: menu }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn icon v-on="{ ...menu, ...tooltip }">
                <v-icon>
                  mdi-dots-vertical-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>More Actions</span>
          </v-tooltip>
        </template>
        <v-list class="py-0">
          <rebuild-dialog :project="project" />
          <remove-dialog :project="project" />
        </v-list>
      </v-menu>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :href="link" target="_blank" v-on="on">
            <v-icon>
              mdi-arrow-right-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Open Editor</span>
      </v-tooltip>
    </div>
    <div v-show="project.state.Status !== 'running'">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn :loading="loading === 'start'" icon @click="action('start')" v-on="on">
            <v-icon>
              mdi-play-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Start</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import RebuildDialog from './rebuild-dialog.vue';
import RemoveDialog from './remove-dialog.vue';

export default {
  components: {
    RebuildDialog,
    RemoveDialog,
  },
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: '',
    };
  },
  computed: {
    link() {
      const { host, protocol } = window.location;
      return `${protocol}//${this.project.slug}.${host}`;
    },
  },
  methods: {
    async action(act) {
      this.loading = act;
      await this.$store.dispatch('projects/power', [this.project.id, act]);
      this.loading = '';
    },
  },
};
</script>
