<template>
  <v-row justify="center" align="center" class="full-height">
    <v-col cols="12" md="8" lg="6">
      <v-card flat outlined>
        <v-card-title class="mb-2 primary">
          Users
          <v-spacer />
          <new-user-dialog />
        </v-card-title>
        <v-data-table
          :items="users"
          :headers="headers"
        >
          <template #item.admin="{ item }">
            <admin-toggle :user="item" />
          </template>
          <template #item.actions="{ item }">
            <v-menu offset-y close-on-content-click>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list class="py-0">
                <change-pass-dialog :user="item">
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-title>Change Password</v-list-item-title>
                    </v-list-item>
                  </template>
                </change-pass-dialog>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import NewUserDialog from '../components/users/new-dialog.vue';
import ChangePassDialog from '../components/users/change-pass-dialog.vue';
import AdminToggle from '../components/users/admin-toggle.vue';

export default {
  components: {
    NewUserDialog,
    AdminToggle,
    ChangePassDialog,
  },
  computed: {
    ...mapGetters('users', { users: 'all' }),
    headers() {
      return [
        { value: 'username', text: 'Username' },
        { value: 'slug', text: 'Slug' },
        { value: 'admin', text: 'Is Admin?' },
        { value: 'actions', text: 'Actions' },
      ];
    },
  },
  mounted() {
    this.$store.dispatch('users/all');
  },
};
</script>

<style>

</style>
