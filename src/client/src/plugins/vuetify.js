import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#009688',
        secondary: '#3f51b5',
        accent: '#2196f3',
      },
      dark: {
        primary: '#009688',
        secondary: '#3f51b5',
        accent: '#2196f3',
      },
    },
  },
});
