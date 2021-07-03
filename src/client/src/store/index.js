import Vue from 'vue';
import Vuex from 'vuex';
import auth from './services/auth';
import base from './services/base';

Vue.use(Vuex);

const defaultAlert = {
  text: '',
  color: '',
  show: false,
};

export default new Vuex.Store({
  state: {
    alert: defaultAlert,
  },
  mutations: {
    showAlert(state, data) {
      state.alert = { ...data, show: true };
    },
    hideAlert(state) {
      state.alert = { ...defaultAlert };
    },
  },
  actions: {
  },
  modules: {
    auth,
    users: base('users', { sortBy: 'username' }),
    projects: base('projects', {
      actions: {
        async power({ commit }, [id, action]) {
          const res = await fetch(`/api/projects/${id}/${action}`);
          const data = await res.json();
          if (data.success === false) throw new Error(data.message);
          commit('add', data.item);
        },
        async scripts() {
          const res = await fetch('/api/projects/scripts');
          const data = await res.json();
          if (data.success === false) throw new Error(data.message);
          return data.item;
        },
      },
    }),
  },
});
