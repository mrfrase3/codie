<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <v-toolbar-title>
      <router-link to="/" style="color: white;" class="text-decoration-none">
        <v-icon left large>mdi-cloud-tags</v-icon>
        Codie
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <v-menu v-if="user" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon large>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-list class="py-0">
        <v-list-item>
          <v-list-item-title>{{user.username}}</v-list-item-title>
        </v-list-item>
        <v-divider />
        <change-pass-dialog :user="user">
          <template #activator="{ on }">
            <v-list-item v-on="on">
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
          </template>
        </change-pass-dialog>
        <v-list-item v-if="user.admin" to="/users">
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <v-list-item to="/logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import ChangePassDialog from './users/change-pass-dialog.vue';

export default {
  components: {
    ChangePassDialog,
  },
  computed: {
    user() {
      return this.$store.getters['auth/loggedInUser'];
    },
  },
};
</script>

<style lang="sass">

.full-height
  min-height: calc(100vh - 64px)

</style>
