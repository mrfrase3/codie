import Vue from 'vue';
import sortBy from 'lodash/sortBy';

export default (
  service,
  config = {},
) => ({
  namespaced: true,
  state: () => ({
    itemsById: {},
    ...(config.state || {}),
  }),
  getters: {
    get: (state) => (id) => state.itemsById[id],
    all: (state) => sortBy(
      Object.values(state.itemsById),
      [(v) => (v[config.sortBy || 'name'] || '').trim().toLowerCase()],
    ),
    ...(config.getters || {}),
  },
  actions: {
    async get({ commit }, id) {
      const res = await fetch(`/api/${service}/${id}/`, { credentials: 'include' });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      commit('add', data.item);
    },
    async all({ commit }) {
      const res = await fetch(`/api/${service}/`, { credentials: 'include' });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      data.items.forEach((item) => commit('add', item));
    },
    async create({ commit }, createData) {
      const res = await fetch(`/api/${service}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      commit('add', data.item);
    },
    async patch({ commit }, [id, patchData]) {
      const res = await fetch(`/api/${service}/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchData),
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      commit('add', data.item);
    },
    async remove({ commit }, id) {
      const res = await fetch(`/api/${service}/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      commit('remove', id);
    },
    ...(config.actions || {}),
  },
  mutations: {
    add(state, item) {
      if (item) {
        Vue.set(state.itemsById, item.id, {
          ...(state.itemsById[item.id] || {}),
          ...item,
        });
      }
    },
    remove(state, id) {
      Vue.delete(state.itemsById, id);
    },
    ...(config.mutations || {}),
  },
});
