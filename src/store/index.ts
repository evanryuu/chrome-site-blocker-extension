import { createStore } from 'vuex';

export interface IVuex {
  app: {
    status: boolean
  }
}

const MUTATION = {
  TOGGLE_APP_STATUS: 'TOGGLE_APP_STATUS',
};

export default createStore({
  state: {
    app: {
      status: false,
    },
  },
  getters: {
  },
  mutations: {
    TOGGLE_APP_STATUS(state) {
      state.app.status = !state.app.status;
    },
  },
  actions: {
    toggleAppStatus(ctx) {
      ctx.commit(MUTATION.TOGGLE_APP_STATUS);
    },
  },
  modules: {
  },
});
