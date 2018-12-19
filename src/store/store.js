import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios')

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token')
  },
  mutations: {
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true
    },
    [LOGOUT] (state) {
      state.isLoggedIn = false
    }
  },
  actions: {
    login ({ commit }, creds) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:1234/authenticate', creds)
          .then((jwt) => {
            localStorage.setItem('token', jwt)
            commit(LOGIN_SUCCESS)
            resolve()
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      commit(LOGOUT)
    }
  },
  getters: {
    isLoggedIn: state => {
      return state.isLoggedIn
    }
  }
})
