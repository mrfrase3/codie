export default {
  namespaced: true,
  state: () => ({
    isLoggedIn: false,
    userId: null,
  }),
  getters: {
    loggedInUser(state, getters, rootState, rootGetters) {
      return rootGetters['users/get'](state.userId);
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      if (res.status !== 200) throw new Error('Invalid Login');
      commit('setLoggedIn', data.item);
      commit('users/add', data.item, { root: true });
    },
    async logout({ commit }) {
      const res = await fetch('/api/auth/logout/');
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      commit('setLoggedIn');
      commit('users/reset', { root: true });
    },
    async init({ commit }) {
      const res = await fetch('/api/auth/ping/');
      const data = await res.json();
      if (data.success === false || res.status !== 200) return false;
      commit('setLoggedIn', data.item);
      commit('users/add', data.item, { root: true });
      return true;
    },
  },
  mutations: {
    setLoggedIn(state, user) {
      // eslint-disable-next-line no-param-reassign
      state.isLoggedIn = !!user;
      // eslint-disable-next-line no-param-reassign
      state.userId = user ? user.id : null;
    },
  },
};
