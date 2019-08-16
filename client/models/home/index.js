
const home = {
  name: 'home',
  state: {
    couter: 0,
    users: [],
    isLoading: false,
  },
  reducers: {
    increment(state, payload) {
      return {
        ...state,
        couter: state.couter + payload,
      };
    },
    requestUsers() {
      return {
        users: [],
        isLoading: true,
      };
    },
    receiveUsers(state, payload) {
      return {
        isLoading: false,
        users: payload,
      };
    },
  },
  effects: {
    async incrementAsync(payload) {
      await new Promise(resolve => setTimeout(resolve, 300));
      this.increment(payload);
    },
    async fetchUsers() {
      try {
        this.requestUsers();
        const response = await fetch('https://api.github.com/users');
        const users = await response.json();
        this.receiveUsers(users);
      } catch (err) {
        this.receiveUsers([]);
      }
    },
  },
};

export default home;
